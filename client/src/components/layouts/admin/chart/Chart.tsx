import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import dayjs from "dayjs";
import { useRevenueAllAPIMutation } from "../../../../api/statistics";
import {
  Space,
  DatePicker,
  Select,
  Button,
  message,
  Card,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

const Chart = () => {
  const [getRevenueAll] = useRevenueAllAPIMutation();
  const [data, setData] = useState<any>();
  const [totalRevenue, setTotalRevenue] = useState("0");
  const [roomRevenue, setRoomRevenue] = useState("0");
  const [serviceRevenue, setServiceRevenue] = useState("0");
  const [chartData, setChartData] = useState([]);
  const [typeSearch, setTypeSearch] = useState("month");
  const [dateRange, setDateRange] = useState<any>();
  const [selectedTime, setSelectedTime] = useState(dayjs().format("MM-YYYY"));

  const formatCurrency = (value: number) =>
    value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const fetchRevenueData = async (params: any) => {
    try {
      const response: any = await getRevenueAll(params).unwrap();
      if (response.error) {
        message.error(response.error);
        resetData();
      } else {
        setData(response);
        setChartData(typeSearch === "month" ? response.dailyRevenue : response.monthlyRevenue);
        setTotalRevenue(formatCurrency(response.total_money));
        setRoomRevenue(formatCurrency(response.total_money_room));
        setServiceRevenue(formatCurrency(response.total_money_service));
      }
    } catch (error) {
      console.error("Error fetching revenue:", error);
      message.error("Có lỗi xảy ra khi lấy dữ liệu.");
      resetData();
    }
  };

  const resetData = () => {
    setData(null);
    setChartData([]);
    setTotalRevenue("0");
    setRoomRevenue("0");
    setServiceRevenue("0");
  };

  const handleSearch = () => {
    if (typeSearch === "day" && (!dateRange || dateRange.length !== 2)) {
      message.error("Vui lòng chọn khoảng thời gian hợp lệ!");
      return;
    }
    const params =
      typeSearch === "day"
        ? { timeline: "day", start: dateRange[0], end: dateRange[1] }
        : { timeline: typeSearch, year: dayjs(selectedTime).year(), month: dayjs(selectedTime).month() + 1 };
    fetchRevenueData(params);
  };

  useEffect(() => {
    const initialParams = { timeline: "month", year: dayjs().year(), month: dayjs().month() + 1 };
    fetchRevenueData(initialParams);
  }, []);

  return (
    <div className="chart-container">
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        Thống kê Doanh Thu
      </Title>

      {/* Bộ lọc */}
      <div className="filter-section" style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <RangePicker
            style={{ marginRight: "10px" }}
            onChange={(dates, dateStrings) => setDateRange(dateStrings)}
            format="DD-MM-YYYY"
            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
          />
          <Button type="primary" onClick={handleSearch}>
            Tra cứu theo ngày
          </Button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Select defaultValue="month" onChange={setTypeSearch}>
            <Option value="month">Theo tháng</Option>
            <Option value="year">Theo năm</Option>
          </Select>
          <DatePicker
            picker={typeSearch}
            format={typeSearch === "month" ? "MM-YYYY" : "YYYY"}
            onChange={(date, dateString) => setSelectedTime(dateString)}
          />
          <Button type="primary" onClick={handleSearch}>
            Tra cứu
          </Button>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <Card title="Tổng doanh thu" style={{ textAlign: "center", width: 300 }}>
          <Text strong>{totalRevenue}</Text>
        </Card>
        <Card title="Doanh thu phòng" style={{ textAlign: "center", width: 300 }}>
          <Text>{roomRevenue}</Text>
        </Card>
        <Card title="Doanh thu dịch vụ" style={{ textAlign: "center", width: 300 }}>
          <Text>{serviceRevenue}</Text>
        </Card>
      </div>

      {/* Biểu đồ */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <Title level={4}>
          Biểu đồ doanh thu {typeSearch === "day" ? "theo ngày" : typeSearch === "month" ? "theo tháng" : "theo năm"}
        </Title>
        <LineChart
          width={1000}
          height={400}
          data={chartData}
          margin={{ top: 10, right: 30, left: 200, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={typeSearch === "day" ? "date" : "month"}
            tickFormatter={(value) =>
              typeSearch === "day" ? value : `Tháng ${value}`
            }
          />
          <YAxis tickFormatter={(value) => formatCurrency(value)} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Legend />
          <Line type="monotone" dataKey="total_money" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
};

export default Chart;
