'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';

export default function Home() {
  const [text, setText] = useState('');
  const [schema, setSchema] = useState('{\n  "name": "string",\n  "age": "number"\n}');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    setLoading(true);
    setError(null);
    try {
      const schemaObj = JSON.parse(schema);
      const response = await apiClient.extract({
        text,
        schema: schemaObj,
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">LangExtract</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Extract structured information from unstructured text using LLMs
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="text" className="block text-sm font-medium mb-2">
              Input Text
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-64 p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              placeholder="Enter the text you want to extract information from..."
            />
          </div>

          <div>
            <label htmlFor="schema" className="block text-sm font-medium mb-2">
              Extraction Schema (JSON)
            </label>
            <textarea
              id="schema"
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg font-mono text-sm dark:bg-gray-800 dark:border-gray-700"
              placeholder='{"field": "type"}'
            />
          </div>

          <button
            onClick={handleExtract}
            disabled={loading || !text || !schema}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Extracting...' : 'Extract Information'}
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Results</h2>
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {result && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          {!result && !error && (
            <div className="p-8 border-2 border-dashed rounded-lg text-center text-gray-400">
              Extraction results will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}