import { useState, useEffect } from 'react';

const useFetchRatings = (roomId: string) => {
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(`/api/ratings?roomId=${roomId}`);
        const data = await response.json();
        setRatings(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load ratings');
        setLoading(false);
      }
    };

    if (roomId) {
      fetchRatings();
    }
  }, [roomId]);

  return { ratings, loading, error };
};

export default useFetchRatings;
