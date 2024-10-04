import { useEffect, useState } from "react";

interface Service {
  id: number;
  name: string;
  description: string;
  // Thêm các thuộc tính khác nếu cần
}

const API_URL = "http://localhost:8000/api";

const useFetchServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_URL}/services`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const data: Service[] = await res.json();
        setServices(data);
      } catch (error: any) {
        setError(error.message);
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading, error };
};

export default useFetchServices;
