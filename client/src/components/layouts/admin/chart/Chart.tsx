import React, { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import useFetchChart from '../../../../api/useFetchChart';

const Chart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { chartData, error } = useFetchChart('month', undefined, undefined, 2023, 10); // Fetch dữ liệu cho tháng 10, 2023

  const [seriesData, setSeriesData] = useState<number[]>([35.1, 23.5, 2.4, 5.4]); // Giá trị mặc định khi không có dữ liệu

  // Lấy dữ liệu từ API và cập nhật dữ liệu series cho biểu đồ
  useEffect(() => {
    if (chartData) {
      console.log('Chart Data:', chartData); // In ra dữ liệu để kiểm tra

      // Nếu API trả về message là không có dữ liệu, giữ nguyên seriesData mặc định
      if (chartData.message) {
        console.warn(chartData.message); // Log ra cảnh báo
        // Không làm gì ở đây, seriesData giữ giá trị mặc định
      } else {
        const { total_money_room, total_money_service } = chartData;
        setSeriesData([
          total_money_room ?? 0, // Nếu không có dữ liệu, gán giá trị 0
          total_money_service ?? 0,
        ]);
      }
    }
  }, [chartData]);

  // Tạo các options cho biểu đồ
  const getChartOptions = () => {
    return {
      series: seriesData,
      colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694"],
      chart: {
        height: 320,
        width: "100%",
        type: "donut",
      },
      stroke: {
        colors: ["transparent"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: 20,
              },
              total: {
                showAlways: true,
                show: true,
                label: "Unique visitors",
                fontFamily: "Inter, sans-serif",
                formatter: function (w) {
                  const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                  return '$' + sum + 'k';
                },
              },
              value: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: -20,
                formatter: function (value) {
                  return value + "k";
                },
              },
            },
            size: "80%",
          },
        },
      },
      grid: {
        padding: {
          top: -2,
        },
      },
      labels: ["Direct", "Sponsor", "Affiliate", "Email marketing"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value + "k";
          },
        },
      },
      xaxis: {
        labels: {
          formatter: function (value) {
            return value + "k";
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    };
  };

  // Render biểu đồ khi dữ liệu đã sẵn sàng
  useEffect(() => {
    if (chartRef.current) {
      const chart = new ApexCharts(chartRef.current, getChartOptions());
      
      chart.render().catch((err) => {
        console.error('Chart Render Error:', err); // Bắt lỗi render nếu có
      });

      return () => {
        chart.destroy(); // Hủy biểu đồ khi component bị hủy
      };
    }
  }, [seriesData]);

  // Xử lý trường hợp lỗi khi gọi API
  if (error) {
    return <p>Error: {error}</p>;
  }

  // Xử lý trạng thái loading khi chưa có dữ liệu từ API
  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {chartData.message && (
        <p>{chartData.message}</p> // Hiển thị thông báo không có dữ liệu (nếu có)
      )}
      <div id="donut-chart" ref={chartRef} /> {/* Vùng hiển thị biểu đồ */}
    </div>
  );
};

export default Chart;
