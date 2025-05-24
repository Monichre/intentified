import { Client as QStashClient } from '@upstash/qstash';

/**
 * Configuration options for the QStash service
 */
export interface QStashConfig {
  token: string;
}

/**
 * QStash Service for message queue operations
 */
export class QStashService {
  private client: QStashClient;

  constructor(config: QStashConfig) {
    this.client = new QStashClient({
      token: config.token,
    });
  }

  /**
   * Get the raw QStash client
   */
  getClient(): QStashClient {
    return this.client;
  }

  /**
   * Send a message to a destination
   */
  async publishMessage<T = any>(
    destination: string, 
    message: T, 
    options?: {
      delay?: number;
      deduplicationId?: string;
      notBefore?: number;
      callback?: string;
      contentType?: string;
      contentBasedDeduplication?: boolean;
      retries?: number;
    }
  ) {
    return this.client.publishJSON({
      url: destination,
      body: message,
      delay: options?.delay,
      deduplicationId: options?.deduplicationId,
      notBefore: options?.notBefore,
      callback: options?.callback,
      contentType: options?.contentType || 'application/json',
      contentBasedDeduplication: options?.contentBasedDeduplication,
      retries: options?.retries,
    });
  }

  /**
   * Schedule a message to be delivered at a specific time
   */
  async scheduleMessage<T = any>(
    destination: string,
    message: T,
    notBefore: number,
    options?: {
      deduplicationId?: string;
      callback?: string;
      contentType?: string;
      contentBasedDeduplication?: boolean;
      retries?: number;
    }
  ) {
    return this.publishMessage(destination, message, {
      ...options,
      notBefore,
    });
  }

  /**
   * Factory method to create a QStash service from environment variables
   */
  static fromEnv(): QStashService {
    const token = process.env.UPSTASH_QSTASH_TOKEN;

    if (!token) {
      throw new Error('Missing Upstash QStash environment variables');
    }

    return new QStashService({ token });
  }
}