import { useState, useEffect } from 'react';

const useFetchRatings = (roomId: string) => {
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        // Kiểm tra roomId có hợp lệ hay không
        if (!roomId) {
          setError('Room ID is required');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/ratings?roomId=${roomId}`);

        // Kiểm tra phản hồi từ API
        if (!response.ok) {
          throw new Error('Failed to fetch ratings');
        }

        const data = await response.json();

        // Kiểm tra xem data có phải là mảng không
        if (Array.isArray(data)) {
          setRatings(data);
        } else {
          setError('Unexpected data format');
        }

        setLoading(false);
      } catch (error) {
        setError('Failed to load ratings');
        setLoading(false);
      }
    };

    fetchRatings();
  }, [roomId]);

  return { ratings, loading, error };
};

export default useFetchRatings;
