/**
 * Workflow Orchestrator Service
 * Implements best practices for multi-step workflow execution
 */

import { generateObject, generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import type {
  WorkflowStep,
  WorkflowPhase,
  WorkflowProgress,
  WorkflowResult,
  WorkflowExecutionOptions
} from './types';

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  phases: WorkflowPhaseDefinition[];
  metadata: {
    category: string;
    estimatedDuration: number; // minutes
    complexity: 'simple' | 'medium' | 'complex';
    prerequisites: string[];
  };
}

export interface WorkflowPhaseDefinition {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStepDefinition[];
  parallel?: boolean; // Can steps run in parallel?
  optional?: boolean;
  conditions?: WorkflowCondition[];
}

export interface WorkflowStepDefinition {
  id: string;
  name: string;
  description: string;
  executor: string; // Service/function to execute this step
  inputs: Record<string, any>;
  outputs: string[];
  dependencies?: string[];
  retryable?: boolean;
  timeout?: number; // minutes
  fallbacks?: WorkflowFallback[];
}

export interface WorkflowCondition {
  type: 'input' | 'previous_result' | 'external';
  condition: string;
  action: 'skip' | 'fail' | 'alternative';
}

export interface WorkflowFallback {
  condition: string;
  alternative: WorkflowStepDefinition;
  description: string;
}

export interface WorkflowContext {
  workflowId: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  stepResults: Map<string, any>;
  errors: Map<string, Error>;
  metadata: Record<string, any>;
}

export interface WorkflowExecutor {
  executeStep(step: WorkflowStepDefinition, context: WorkflowContext): Promise<any>;
  validateInputs(inputs: Record<string, any>, requirements: Record<string, any>): boolean;
  handleError(error: Error, step: WorkflowStepDefinition, context: WorkflowContext): Promise<void>;
}

export class WorkflowOrchestratorService {
  private model = anthropic('claude-3-5-sonnet-20241022');
  private executors = new Map<string, WorkflowExecutor>();
  private activeWorkflows = new Map<string, WorkflowContext>();

  /**
   * Register a workflow executor for a specific step type
   */
  registerExecutor(stepType: string, executor: WorkflowExecutor): void {
    this.executors.set(stepType, executor);
  }

  /**
   * Execute a complete workflow with best practices
   */
  async executeWorkflow<T = any>(
    definition: WorkflowDefinition,
    inputs: Record<string, any>,
    options: WorkflowExecutionOptions
  ): Promise<WorkflowResult<T>> {
    const startTime = new Date();
    const context = this.createWorkflowContext(options.workflowId, inputs);
    
    try {
      // Validate workflow definition
      this.validateWorkflowDefinition(definition);
      
      // Validate inputs
      this.validateWorkflowInputs(inputs, definition);
      
      // Store active workflow
      this.activeWorkflows.set(options.workflowId, context);
      
      // Execute phases sequentially
      const phases: WorkflowPhase[] = [];
      
      for (const phaseDefinition of definition.phases) {
        const phase = await this.executePhase(
          phaseDefinition,
          context,
          options
        );
        
        phases.push(phase);
        
        // Check if phase failed and workflow should stop
        if (phase.status === 'failed' && !options.continueOnError) {
          break;
        }
        
        options.onPhaseComplete?.(phase);
      }
      
      // Determine overall status
      const failedPhases = phases.filter(p => p.status === 'failed');
      const status = failedPhases.length > 0 ? 'failed' : 'completed';
      
      // Calculate statistics
      const allSteps = phases.flatMap(p => p.steps);
      const completedSteps = allSteps.filter(s => s.status === 'completed').length;
      const failedSteps = allSteps.filter(s => s.status === 'failed').length;
      const skippedSteps = allSteps.filter(s => s.status === 'skipped').length;
      
      const result: WorkflowResult<T> = {
        workflowId: options.workflowId,
        status,
        phases,
        result: context.outputs as T,
        metadata: {
          startTime,
          endTime: new Date(),
          totalDuration: (Date.now() - startTime.getTime()) / 60000,
          completedSteps,
          failedSteps,
          skippedSteps
        }
      };
      
      return result;
      
    } catch (error) {
      const result: WorkflowResult<T> = {
        workflowId: options.workflowId,
        status: 'failed',
        phases: [],
        error: error instanceof Error ? error.message : String(error),
        metadata: {
          startTime,
          endTime: new Date(),
          totalDuration: (Date.now() - startTime.getTime()) / 60000,
          completedSteps: 0,
          failedSteps: 1,
          skippedSteps: 0
        }
      };
      
      options.onError?.(error instanceof Error ? error : new Error(String(error)));
      return result;
      
    } finally {
      // Cleanup
      this.activeWorkflows.delete(options.workflowId);
    }
  }

  /**
   * Execute a single workflow phase
   */
  private async executePhase(
    phaseDefinition: WorkflowPhaseDefinition,
    context: WorkflowContext,
    options: WorkflowExecutionOptions
  ): Promise<WorkflowPhase> {
    const phase: WorkflowPhase = {
      id: phaseDefinition.id,
      name: phaseDefinition.name,
      description: phaseDefinition.description,
      steps: [],
      status: 'in_progress',
      progress: 0
    };
    
    try {
      // Check phase conditions
      if (phaseDefinition.conditions) {
        const shouldExecute = await this.evaluateConditions(
          phaseDefinition.conditions,
          context
        );
        
        if (!shouldExecute) {
          phase.status = 'completed';
          phase.progress = 100;
          return phase;
        }
      }
      
      // Execute steps
      if (phaseDefinition.parallel) {
        // Execute steps in parallel
        const stepPromises = phaseDefinition.steps.map(stepDef =>
          this.executeStep(stepDef, context, options)
        );
        
        const steps = await Promise.allSettled(stepPromises);
        
        steps.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            phase.steps.push(result.value);
          } else {
            // Handle failed step
            const stepDef = phaseDefinition.steps[index];
            const failedStep: WorkflowStep = {
              id: stepDef.id,
              name: stepDef.name,
              description: stepDef.description,
              phase: phase.id,
              required: true,
              status: 'failed',
              error: result.reason?.message || 'Unknown error'
            };
            phase.steps.push(failedStep);
          }
        });
        
      } else {
        // Execute steps sequentially
        for (const stepDefinition of phaseDefinition.steps) {
          const step = await this.executeStep(stepDefinition, context, options);
          phase.steps.push(step);
          
          // Update phase progress
          phase.progress = (phase.steps.length / phaseDefinition.steps.length) * 100;
          
          // Check if step failed and should stop phase
          if (step.status === 'failed' && step.required && !options.continueOnError) {
            phase.status = 'failed';
            return phase;
          }
          
          options.onStepComplete?.(step);
        }
      }
      
      // Determine phase status
      const failedSteps = phase.steps.filter(s => s.status === 'failed' && s.required);
      phase.status = failedSteps.length > 0 ? 'failed' : 'completed';
      phase.progress = 100;
      
      return phase;
      
    } catch (error) {
      phase.status = 'failed';
      throw error;
    }
  }

  /**
   * Execute a single workflow step
   */
  private async executeStep(
    stepDefinition: WorkflowStepDefinition,
    context: WorkflowContext,
    options: WorkflowExecutionOptions
  ): Promise<WorkflowStep> {
    const step: WorkflowStep = {
      id: stepDefinition.id,
      name: stepDefinition.name,
      description: stepDefinition.description,
      phase: '', // Will be set by phase executor
      dependencies: stepDefinition.dependencies,
      estimatedDuration: stepDefinition.timeout,
      required: !stepDefinition.fallbacks?.length,
      status: 'in_progress'
    };
    
    try {
      // Check dependencies
      if (stepDefinition.dependencies) {
        const dependenciesMet = this.checkDependencies(
          stepDefinition.dependencies,
          context
        );
        
        if (!dependenciesMet) {
          step.status = 'skipped';
          step.error = 'Dependencies not met';
          return step;
        }
      }
      
      // Get executor
      const executor = this.executors.get(stepDefinition.executor);
      if (!executor) {
        throw new Error(`No executor found for step type: ${stepDefinition.executor}`);
      }
      
      // Validate inputs
      const inputsValid = executor.validateInputs(
        stepDefinition.inputs,
        stepDefinition.inputs
      );
      
      if (!inputsValid) {
        throw new Error('Step input validation failed');
      }
      
      // Execute with timeout
      const timeoutMs = (stepDefinition.timeout || 30) * 60 * 1000;
      const executePromise = executor.executeStep(stepDefinition, context);
      
      const result = await Promise.race([
        executePromise,
        this.createTimeoutPromise(timeoutMs)
      ]);
      
      // Store result
      step.result = result;
      context.stepResults.set(step.id, result);
      
      // Update context outputs
      if (stepDefinition.outputs) {
        stepDefinition.outputs.forEach(outputKey => {
          if (result && typeof result === 'object' && outputKey in result) {
            context.outputs[outputKey] = result[outputKey];
          }
        });
      }
      
      step.status = 'completed';
      return step;
      
    } catch (error) {
      // Handle error with retries and fallbacks
      return await this.handleStepError(
        error instanceof Error ? error : new Error(String(error)),
        stepDefinition,
        context,
        options,
        step
      );
    }
  }

  /**
   * Handle step execution errors with retries and fallbacks
   */
  private async handleStepError(
    error: Error,
    stepDefinition: WorkflowStepDefinition,
    context: WorkflowContext,
    options: WorkflowExecutionOptions,
    step: WorkflowStep,
    retryCount: number = 0
  ): Promise<WorkflowStep> {
    // Store error
    context.errors.set(step.id, error);
    
    // Try retries if step is retryable
    if (stepDefinition.retryable && retryCount < (options.maxRetries || 3)) {
      try {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        
        const executor = this.executors.get(stepDefinition.executor);
        if (executor) {
          const result = await executor.executeStep(stepDefinition, context);
          step.result = result;
          step.status = 'completed';
          return step;
        }
      } catch (retryError) {
        return this.handleStepError(
          retryError instanceof Error ? retryError : new Error(String(retryError)),
          stepDefinition,
          context,
          options,
          step,
          retryCount + 1
        );
      }
    }
    
    // Try fallbacks
    if (stepDefinition.fallbacks?.length) {
      for (const fallback of stepDefinition.fallbacks) {
        try {
          const shouldUseFallback = await this.evaluateFallbackCondition(
            fallback.condition,
            error,
            context
          );
          
          if (shouldUseFallback) {
            const fallbackResult = await this.executeStep(
              fallback.alternative,
              context,
              options
            );
            
            if (fallbackResult.status === 'completed') {
              step.result = fallbackResult.result;
              step.status = 'completed';
              step.error = `Primary execution failed, used fallback: ${fallback.description}`;
              return step;
            }
          }
        } catch (fallbackError) {
          // Continue to next fallback
          continue;
        }
      }
    }
    
    // No retries or fallbacks worked
    step.status = 'failed';
    step.error = error.message;
    
    options.onError?.(error, step);
    
    return step;
  }

  /**
   * Validate workflow definition structure and dependencies
   */
  private validateWorkflowDefinition(definition: WorkflowDefinition): void {
    if (!definition.id || !definition.name || !definition.phases.length) {
      throw new Error('Invalid workflow definition: missing required fields');
    }
    
    // Check for circular dependencies
    const allSteps = definition.phases.flatMap(p => p.steps);
    const stepIds = new Set(allSteps.map(s => s.id));
    
    for (const step of allSteps) {
      if (step.dependencies) {
        for (const dep of step.dependencies) {
          if (!stepIds.has(dep)) {
            throw new Error(`Step ${step.id} has undefined dependency: ${dep}`);
          }
        }
      }
    }
    
    // TODO: Add more sophisticated cycle detection
  }

  /**
   * Validate workflow inputs against requirements
   */
  private validateWorkflowInputs(
    inputs: Record<string, any>,
    definition: WorkflowDefinition
  ): void {
    // Extract required inputs from step definitions
    const requiredInputs = new Set<string>();
    
    definition.phases.forEach(phase => {
      phase.steps.forEach(step => {
        Object.keys(step.inputs).forEach(inputKey => {
          if (step.inputs[inputKey] === '{{required}}') {
            requiredInputs.add(inputKey);
          }
        });
      });
    });
    
    // Check if all required inputs are provided
    for (const required of requiredInputs) {
      if (!(required in inputs)) {
        throw new Error(`Missing required input: ${required}`);
      }
    }
  }

  /**
   * Create workflow execution context
   */
  private createWorkflowContext(
    workflowId: string,
    inputs: Record<string, any>
  ): WorkflowContext {
    return {
      workflowId,
      inputs,
      outputs: {},
      stepResults: new Map(),
      errors: new Map(),
      metadata: {
        startTime: new Date(),
        environment: process.env.NODE_ENV || 'development'
      }
    };
  }

  /**
   * Check if step dependencies are satisfied
   */
  private checkDependencies(
    dependencies: string[],
    context: WorkflowContext
  ): boolean {
    return dependencies.every(dep => {
      const result = context.stepResults.get(dep);
      return result !== undefined && result !== null;
    });
  }

  /**
   * Evaluate workflow conditions using AI
   */
  private async evaluateConditions(
    conditions: WorkflowCondition[],
    context: WorkflowContext
  ): Promise<boolean> {
    for (const condition of conditions) {
      const result = await this.evaluateCondition(condition, context);
      if (!result) {
        return false;
      }
    }
    return true;
  }

  /**
   * Evaluate a single condition
   */
  private async evaluateCondition(
    condition: WorkflowCondition,
    context: WorkflowContext
  ): Promise<boolean> {
    const prompt = `Evaluate this workflow condition:
    
    Condition Type: ${condition.type}
    Condition: ${condition.condition}
    
    Context:
    - Inputs: ${JSON.stringify(context.inputs, null, 2)}
    - Current Outputs: ${JSON.stringify(context.outputs, null, 2)}
    - Step Results Available: ${Array.from(context.stepResults.keys()).join(', ')}
    
    Return true if the condition is met, false otherwise.
    Consider the condition carefully and evaluate based on the available context.`;

    const result = await generateObject({
      model: this.model,
      schema: z.object({
        result: z.boolean(),
        reasoning: z.string()
      }),
      prompt
    });

    return result.object.result;
  }

  /**
   * Evaluate fallback conditions
   */
  private async evaluateFallbackCondition(
    condition: string,
    error: Error,
    context: WorkflowContext
  ): Promise<boolean> {
    const prompt = `Evaluate if this fallback should be used:
    
    Fallback Condition: ${condition}
    Error: ${error.message}
    Error Type: ${error.constructor.name}
    
    Context:
    - Workflow ID: ${context.workflowId}
    - Available Results: ${Array.from(context.stepResults.keys()).join(', ')}
    
    Return true if the fallback condition matches the current error/context.`;

    const result = await generateObject({
      model: this.model,
      schema: z.object({
        result: z.boolean(),
        reasoning: z.string()
      }),
      prompt
    });

    return result.object.result;
  }

  /**
   * Create a timeout promise
   */
  private createTimeoutPromise(timeoutMs: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Step execution timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });
  }

  /**
   * Get workflow status and progress
   */
  getWorkflowStatus(workflowId: string): WorkflowProgress | null {
    const context = this.activeWorkflows.get(workflowId);
    if (!context) {
      return null;
    }

    // Calculate progress based on completed steps
    const completedSteps = Array.from(context.stepResults.keys()).length;
    const totalSteps = context.metadata.totalSteps || 1;
    
    return {
      currentPhase: context.metadata.currentPhase || 'unknown',
      currentStep: context.metadata.currentStep || 'unknown',
      overallProgress: (completedSteps / totalSteps) * 100,
      phaseProgress: context.metadata.phaseProgress || 0,
      stepProgress: context.metadata.stepProgress || 0,
      message: context.metadata.statusMessage || 'Processing...',
      estimatedTimeRemaining: context.metadata.estimatedTimeRemaining
    };
  }

  /**
   * Cancel an active workflow
   */
  async cancelWorkflow(workflowId: string, reason?: string): Promise<boolean> {
    const context = this.activeWorkflows.get(workflowId);
    if (!context) {
      return false;
    }

    // Mark as cancelled
    context.metadata.cancelled = true;
    context.metadata.cancelReason = reason || 'User cancelled';
    
    // Cleanup
    this.activeWorkflows.delete(workflowId);
    
    return true;
  }

  /**
   * Generate workflow analytics and insights
   */
  async analyzeWorkflowPerformance(results: WorkflowResult[]): Promise<string> {
    const prompt = `Analyze these workflow execution results and provide insights:

    ${results.map(r => `
    Workflow: ${r.workflowId}
    Status: ${r.status}
    Duration: ${r.metadata.totalDuration} minutes
    Completed Steps: ${r.metadata.completedSteps}
    Failed Steps: ${r.metadata.failedSteps}
    Skipped Steps: ${r.metadata.skippedSteps}
    `).join('\n')}

    Provide analysis on:
    1. Success rates and failure patterns
    2. Performance trends and bottlenecks
    3. Common failure points
    4. Optimization recommendations
    5. Best practices for workflow design`;

    const result = await generateText({
      model: this.model,
      prompt
    });

    return result.text;
  }
}