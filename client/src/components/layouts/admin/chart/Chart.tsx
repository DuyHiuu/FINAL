import React, { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import useFetchChart from '../../../../api/useFetchChart';

const Chart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { chartData, error } = useFetchChart('month', undefined, undefined, 2023, 10); // Lấy dữ liệu cho tháng 10, 2023

  const [seriesData, setSeriesData] = useState<number[]>([35.1, 23.5, 2.4, 5.4]); // Giá trị mặc định khi không có dữ liệu

  // Lấy dữ liệu từ API và cập nhật dữ liệu series cho biểu đồ
  useEffect(() => {
    if (chartData) {
      console.log('Dữ liệu biểu đồ:', chartData); // In ra dữ liệu để kiểm tra

      // Nếu API trả về message là không có dữ liệu, giữ nguyên seriesData mặc định
      if (chartData.message) {
        console.warn(chartData.message); // Log cảnh báo
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

  // Tạo các tùy chọn cho biểu đồ cột
  const getChartOptions = () => {
    return {
      series: [
        {
          name: "Doanh thu",
          data: seriesData,
        },
      ],
      colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694"],
      chart: {
        type: "bar", // Loại biểu đồ cột
        height: 350,
        width: "100%",
      },
      plotOptions: {
        bar: {
          horizontal: false, // Thiết lập cột dọc
          columnWidth: "50%", // Độ rộng của cột
        },
      },
      dataLabels: {
        enabled: false, // Tắt nhãn trên các cột
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: ["Phòng", "Dịch vụ"], // Nhãn x tương ứng với dữ liệu
      },
      yaxis: {
        title: {
          text: "Doanh thu (nghìn $)", // Đơn vị đo trên trục y
        },
        labels: {
          formatter: function (value) {
            return value + "k"; // Hiển thị đơn vị là "k"
          },
        },
      },
      fill: {
        opacity: 1, // Độ trong suốt của cột
      },
      tooltip: {
        y: {
          formatter: function (value) {
            return "$" + value + "k"; // Hiển thị tooltip với đơn vị là "$k"
          },
        },
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
    };
  };

  useEffect(() => {
    const chart = new ApexCharts(chartRef.current, getChartOptions());
    chart.render();
    return () => {
      chart.destroy();
    };
  }, [seriesData]);

  return <div id="bar-chart" ref={chartRef}></div>;
};

export default Chart;
