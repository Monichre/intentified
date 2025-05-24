/**
 * Service Registry for the data layer
 * 
 * This registry provides a central place to register and retrieve services.
 * It follows a flexible, extensible pattern that allows for dependency injection
 * and service composition.
 */

type ServiceFactory<T> = () => T;
type ServiceMap = Map<string, any>;

/**
 * The Registry class provides a central place to register and access services
 */
export class Registry {
  private static instance: Registry;
  private services: ServiceMap = new Map();
  private factories: Map<string, ServiceFactory<any>> = new Map();

  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}

  /**
   * Get the singleton instance of the registry
   */
  public static getInstance(): Registry {
    if (!Registry.instance) {
      Registry.instance = new Registry();
    }
    return Registry.instance;
  }

  /**
   * Register a service factory
   */
  public registerFactory<T>(name: string, factory: ServiceFactory<T>): void {
    this.factories.set(name, factory);
  }

  /**
   * Register a service instance
   */
  public register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  /**
   * Get a service instance, creating it if necessary
   */
  public get<T>(name: string): T {
    if (this.services.has(name)) {
      return this.services.get(name) as T;
    }

    if (this.factories.has(name)) {
      const factory = this.factories.get(name) as ServiceFactory<T>;
      const service = factory();
      this.services.set(name, service);
      return service;
    }

    throw new Error(`Service '${name}' not registered`);
  }

  /**
   * Check if a service is registered
   */
  public has(name: string): boolean {
    return this.services.has(name) || this.factories.has(name);
  }

  /**
   * Remove a service
   */
  public remove(name: string): boolean {
    const hadService = this.services.delete(name);
    const hadFactory = this.factories.delete(name);
    return hadService || hadFactory;
  }

  /**
   * Reset the registry (clear all services and factories)
   */
  public reset(): void {
    this.services.clear();
    this.factories.clear();
  }
}

/**
 * Convenience function to get the registry instance
 */
export const getRegistry = (): Registry => Registry.getInstance();