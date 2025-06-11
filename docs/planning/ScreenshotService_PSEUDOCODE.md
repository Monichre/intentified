# Screenshot Service Implementation Pseudocode

## Overview
Build a comprehensive screenshot service module around the screenshothis.com API for use throughout the application.

## Module Structure

### 1. Type Definitions
```typescript
// Configuration interface for screenshot requests
interface ScreenshotConfig {
  url: string                           // Target URL to screenshot
  blockAds?: boolean                    // Block advertisements (default: true)
  blockCookieBanners?: boolean          // Block cookie banners (default: true)
  blockTrackers?: boolean               // Block tracking scripts (default: true)
  prefersColorScheme?: 'light' | 'dark' // Color scheme preference (default: 'light')
  format?: 'png' | 'jpeg' | 'webp'     // Image format (default: 'png')
  fullPage?: boolean                    // Capture full page (default: false)
  viewportWidth?: number                // Viewport width (default: 1920)
  viewportHeight?: number               // Viewport height (default: 1080)
  delay?: number                        // Delay before capture in ms (default: 0)
}

// Response types
interface ScreenshotResponse {
  success: boolean
  imageUrl?: string
  error?: string
  metadata?: {
    url: string
    timestamp: number
    format: string
    size?: number
  }
}

interface ScreenshotError {
  code: string
  message: string
  details?: any
}
```

### 2. Core Service Functions

#### Primary Screenshot Function
```typescript
export async function takeScreenshot(config: ScreenshotConfig): Promise<ScreenshotResponse>
  1. Validate input configuration
     - Check if URL is valid
     - Ensure API key is available
     - Validate optional parameters
  
  2. Build API request URL
     - Encode target URL properly
     - Add query parameters based on config
     - Include API key
  
  3. Make HTTP request to screenshothis API
     - Handle network errors
     - Parse response
     - Check for API errors
  
  4. Return structured response
     - Success: return image URL and metadata
     - Error: return error details
```

#### URL Validation Helper
```typescript
function validateUrl(url: string): boolean
  1. Check if URL is a valid format
  2. Ensure it includes protocol (http/https)
  3. Validate domain structure
  4. Return validation result
```

#### API URL Builder
```typescript
function buildApiUrl(config: ScreenshotConfig): string
  1. Start with base API URL
  2. Add API key parameter
  3. Encode target URL
  4. Add optional parameters:
     - block_ads
     - block_cookie_banners
     - block_trackers
     - prefers_color_scheme
     - format
     - full_page
     - viewport_width
     - viewport_height
     - delay
  5. Return complete API URL
```

#### Error Handler
```typescript
function handleScreenshotError(error: any): ScreenshotError
  1. Determine error type (network, API, validation)
  2. Extract meaningful error message
  3. Return structured error object
```

### 3. Utility Functions

#### URL Encoding
```typescript
function encodeTargetUrl(url: string): string
  1. Ensure URL has protocol
  2. URL encode the entire URL
  3. Return encoded string
```

#### Default Configuration
```typescript
function getDefaultConfig(): Partial<ScreenshotConfig>
  1. Return sensible defaults for all optional parameters
  2. Optimize for common use cases
```

#### Configuration Merger
```typescript
function mergeConfig(userConfig: ScreenshotConfig): ScreenshotConfig
  1. Take user provided config
  2. Merge with default config
  3. Validate final configuration
  4. Return complete config object
```

### 4. Advanced Features

#### Batch Screenshots
```typescript
export async function takeMultipleScreenshots(configs: ScreenshotConfig[]): Promise<ScreenshotResponse[]>
  1. Validate all configurations
  2. Process screenshots in parallel (with rate limiting)
  3. Collect all results
  4. Return array of responses
```

#### Screenshot with Retry Logic
```typescript
export async function takeScreenshotWithRetry(config: ScreenshotConfig, maxRetries = 3): Promise<ScreenshotResponse>
  1. Attempt screenshot
  2. If failed and retries remaining:
     - Wait with exponential backoff
     - Retry with same config
  3. Return final result or accumulated errors
```

#### Cache Integration (Optional)
```typescript
function getCacheKey(config: ScreenshotConfig): string
function cacheScreenshot(key: string, response: ScreenshotResponse): void
function getCachedScreenshot(key: string): ScreenshotResponse | null
```

### 5. Error Handling Strategy

#### Error Types
1. **Validation Errors**
   - Invalid URL format
   - Missing API key
   - Invalid configuration parameters

2. **Network Errors**
   - Request timeout
   - Connection refused
   - DNS resolution failure

3. **API Errors**
   - Invalid API key
   - Rate limit exceeded
   - Service unavailable
   - Invalid parameters

4. **Response Errors**
   - Malformed response
   - Missing image URL
   - Image generation failed

#### Error Recovery
1. Retry logic for transient errors
2. Fallback mechanisms where possible
3. Detailed error reporting for debugging
4. Graceful degradation

### 6. Environment Configuration

#### Environment Variables
- `SCREENSHOT_API_KEY`: Required API key for screenshothis.com
- `SCREENSHOT_API_BASE_URL`: Base URL for the API (with default)
- `SCREENSHOT_DEFAULT_TIMEOUT`: Default request timeout
- `SCREENSHOT_MAX_RETRIES`: Default retry count

### 7. Usage Examples

#### Basic Usage
```typescript
const result = await takeScreenshot({
  url: 'https://example.com'
})
```

#### Advanced Usage
```typescript
const result = await takeScreenshot({
  url: 'https://example.com',
  fullPage: true,
  format: 'webp',
  viewportWidth: 1280,
  viewportHeight: 720,
  prefersColorScheme: 'dark'
})
```

#### Batch Processing
```typescript
const configs = [
  { url: 'https://site1.com' },
  { url: 'https://site2.com' }
]
const results = await takeMultipleScreenshots(configs)
```

### 8. Testing Strategy

#### Unit Tests
- Configuration validation
- URL encoding
- Error handling
- Default merging

#### Integration Tests
- API connectivity
- Response parsing
- Error scenarios

#### Mock Testing
- API response mocking
- Network failure simulation
- Rate limiting scenarios

### 9. Performance Considerations

#### Rate Limiting
- Implement client-side rate limiting
- Queue management for batch requests
- Respect API limits

#### Memory Management
- Stream large responses where possible
- Clean up temporary resources
- Monitor memory usage in batch operations

#### Timeout Handling
- Configurable request timeouts
- Graceful timeout handling
- Progress reporting for long operations

### 10. Integration Points

#### With AI Services
- Screenshot generation for competitor analysis
- Website preview generation
- Content analysis support

#### With Storage
- Save screenshots to Supabase storage
- Generate public URLs
- Manage file lifecycle

#### With Caching
- Redis/memory caching for frequent requests
- Cache invalidation strategies
- Performance optimization 