// src/services/customCaptureService.ts
import fetch from 'node-fetch'; // or global fetch in your environment

// ─── Constants ──────────────────────────────────────────────────────────────
const BASE_URL    = 'https://cdn.capture.page';
const API_KEY     = 'c0487bc8-3bed-46c0-b7e4-a87bf56643dd';
const SIGNATURE   = '454c149099d72e92eef6cb5770afd16b';
const DEFAULT_DELAY = 1;

export type CaptureType = 'image' | 'pdf' | 'content' | 'metadata';

export interface CaptureResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── URL Builder ────────────────────────────────────────────────────────────
function buildUrl(
  rawUrl: string,
  type: CaptureType,
  delay: number = DEFAULT_DELAY
): string {
  const encoded = encodeURIComponent(rawUrl);
  return `${BASE_URL}/${API_KEY}/${SIGNATURE}/${type}?url=${encoded}&delay=${delay}`;
}

// ─── Core Fetch ─────────────────────────────────────────────────────────────
async function fetchCapture<T>(
  rawUrl: string,
  type: CaptureType,
  delay?: number
): Promise<CaptureResult<T>> {
  const url = buildUrl(rawUrl, type, delay);

  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`${type} failed: ${res.status} ${res.statusText}`);
    const data = (await res.json()) as T;
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ─── Public API ────────────────────────────────────────────────────────────
export const customCaptureService = {
  screenshot: (url: string, delay?: number) =>
    fetchCapture<string>(url, 'image', delay),
  pdf: (url: string, delay?: number) =>
    fetchCapture<string>(url, 'pdf', delay),
  content: (url: string, delay?: number) =>
    fetchCapture<any>(url, 'content', delay),
  metadata: (url: string, delay?: number) =>
    fetchCapture<any>(url, 'metadata', delay),
};