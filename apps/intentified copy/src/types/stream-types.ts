/* ------------------------------------------------------------------ *
 * Shared Stream Types and Interfaces                                 *
 * ------------------------------------------------------------------ */

/**
 * Generic stream state interface that can be specialized for different
 * types of streaming operations (enrichment, competitor analysis, etc.)
 */
export interface StreamState<TProgress, TResult, TMessageType extends string = string> {
  status:
    | "idle"
    | "connecting" 
    | "connected"
    | "processing"
    | "completed"
    | "error"
    | "disconnected";
  progress: TProgress | null;
  result: TResult | null;
  error: string | null;
  messages: Array<{
    type: TMessageType;
    data: any;
    timestamp: string;
  }>;
}

/**
 * Generic stream options interface for configuration
 */
export interface StreamOptions<TRequest, TProgress, TResult> {
  onProgress?: (progress: TProgress) => void;
  onComplete?: (result: TResult) => void;
  onError?: (error: string) => void;
}

/**
 * Generic stream update types for type-safe streaming
 */
export type StreamUpdate<TProgress, TResult> =
  | { type: "progress"; progress: TProgress }
  | { type: "result"; result: TResult }
  | { type: "error"; error: string };

/**
 * Base stream hook interface that all stream hooks should implement
 */
export interface StreamHook<TState, TOptions> {
  state: TState;
  connect: (options: TOptions) => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  isProcessing: boolean;
  isCompleted: boolean;
  hasError: boolean;
}

/**
 * Common status helpers for stream components
 */
export const streamStatusHelpers = {
  isIdle: (status: StreamState<any, any>['status']) => status === "idle",
  isConnecting: (status: StreamState<any, any>['status']) => status === "connecting",
  isActive: (status: StreamState<any, any>['status']) => 
    status === "connected" || status === "processing",
  isProcessing: (status: StreamState<any, any>['status']) => status === "processing",
  isCompleted: (status: StreamState<any, any>['status']) => status === "completed",
  hasError: (status: StreamState<any, any>['status']) => status === "error",
  isDisconnected: (status: StreamState<any, any>['status']) => status === "disconnected",
} as const; 