import { useState } from 'react';

export function useLabelAISuggestion({ usageData, goal }: { usageData: { labelsPerDay: number, labelsPerRoll: number, days: number }, goal: string }) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestion = async () => {
    setLoading(true);
    setError(null);
    setSuggestion(null);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/label-ai', {
        method: 'POST',
        headers,
        body: JSON.stringify({ usageData, goal }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuggestion(data.suggestion);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (e) {
      setError(e?.toString() || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { suggestion, loading, error, refetch: fetchSuggestion };
} 