# Data Layer

This package provides database access layer for the Intentified Platform.

## Overview

The data layer package is responsible for database connections, models, and utilities for working with the database. It uses Prisma ORM with PostgreSQL and Neon serverless connection pooling, along with Upstash Redis and QStash for distributed data operations.

## Features

- Prisma ORM with PostgreSQL
- Neon serverless connection pooling
- Document processing with vector embeddings
- CSV import functionality
- Service Registry pattern for dependency management
- Redis caching with Upstash
- Message queuing with QStash
- Type-safe database access

## Setup

1. Copy `.env.example` to `.env` and fill in the environment variables:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
bun install
```

3. Generate Prisma client:

```bash
bun run build
```

## Service Registry

The data layer uses a Service Registry pattern to manage dependencies and make the package more flexible. Services are registered and retrieved by name, making it easy to extend and customize the functionality.

### Built-in Services

- `redis`: Redis service for caching and key-value storage
- `qstash`: QStash service for message queuing
- `document-cache`: Document caching service built on Redis
- `document-queue`: Document processing queue service built on QStash
- `document-processing`: Document processing utilities for database operations
- `csv-import`: CSV import utilities for database operations
- `storage`: Storage utilities for Supabase storage

### Using Services

```typescript
import { getService, ServiceName, DatabaseService } from '@repo/db';

// Using helper methods
const redis = DatabaseService.getRedisService();
const qstash = DatabaseService.getQStashService();

// Or using the registry directly
const documentCache = getService(ServiceName.DOCUMENT_CACHE);
const documentQueue = getService(ServiceName.DOCUMENT_QUEUE);

// Direct access to utilities
import { DocumentProcessing, CSVImport } from '@repo/database';
const documents = await DocumentProcessing.getUserDocuments('user-id');
const csvFile = await CSVImport.getCSVFile('file-id');
```

### Registering Custom Services

```typescript
import { registerService, registerServiceFactory } from '@repo/database';

// Register a service instance
registerService('my-service', new MyService());

// Register a factory function
registerServiceFactory('my-factory-service', () => {
  return new MyFactoryService();
});
```

## Document Processing

The document processing functionality provides APIs for:

- Document management (upload, fetch, update)
- Document chunking and vector embeddings
- Vector similarity search
- Entity extraction
- Document analysis

## CSV Import

The CSV import functionality provides APIs for:

- CSV file import management
- CSV row validation and storage
- Data extraction from CSV files

## PostgreSQL Extensions

This package uses PostgreSQL extensions for advanced functionality:

- `vector`: For vector embeddings and similarity search
- `pg_net`: For async HTTP requests (if needed)
- `pgcrypto`: For generating UUIDs

These extensions need to be enabled in your PostgreSQL database.

## Redis and QStash Setup

To use Redis and QStash functionality, you need to set up Upstash accounts and get your credentials. Then add them to your `.env` file:

```
UPSTASH_REDIS_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_TOKEN="your-redis-token"
UPSTASH_QSTASH_TOKEN="your-qstash-token"
```

## Document Processing Endpoints

Set up endpoints for document processing in your `.env` file:

```
DOCUMENT_EXTRACT_ENDPOINT="https://your-api-url/api/extract"
DOCUMENT_ANALYZE_ENDPOINT="https://your-api-url/api/analyze"
DOCUMENT_VECTORIZE_ENDPOINT="https://your-api-url/api/vectorize"
```

These endpoints will be used by the QStash service to trigger document processing tasks.
