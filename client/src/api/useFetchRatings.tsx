// useFetchRatings.ts
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
        setRatings(data); // Giả sử API trả về một mảng các đánh giá
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
