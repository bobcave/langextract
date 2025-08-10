const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ExtractionRequest {
  text: string;
  schema: Record<string, any>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export interface ExtractionResponse {
  extractions: Array<{
    data: Record<string, any>;
    confidence?: number;
    source?: string;
  }>;
  metadata?: {
    model: string;
    chunks?: number;
    processing_time?: number;
  };
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  async extract(request: ExtractionRequest): Promise<ExtractionResponse> {
    const response = await fetch(`${this.baseUrl}/api/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async uploadDocument(file: File): Promise<{ documentId: string; text: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload Error: ${response.statusText}`);
    }

    return response.json();
  }

  async getProviders(): Promise<Array<{ id: string; name: string; models: string[] }>> {
    const response = await fetch(`${this.baseUrl}/api/providers`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient();