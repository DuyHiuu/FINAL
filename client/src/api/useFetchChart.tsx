import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000/api";

// Custom hook để lấy dữ liệu từ API
const useFetchChart = (timeline: string, start?: string, end?: string, year?: number, month?: number) => {
  const [chartData, setChartData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const queryParams = new URLSearchParams({
          timeline,
          ...(start && { start }),
          ...(end && { end }),
          ...(year && { year: year.toString() }),
          ...(month && { month: month.toString() }),
        }).toString();

        const response = await fetch(`${API_URL}/chart/total-revenue?${queryParams}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setChartData(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchChartData();
  }, [timeline, start, end, year, month]);

  return { chartData, error };
};

export default useFetchChart;
