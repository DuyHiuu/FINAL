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
import type { Dayjs } from "dayjs";
import { useRevenueAllAPIMutation } from "../../../../api/statistics";
import {
  Space,
  DatePicker,
  DatePickerProps,
  Select,
  Button,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";
const { RangePicker } = DatePicker;
const { Option } = Select;
const Chart = () => {
  const [getRevenueAll] = useRevenueAllAPIMutation();
  const [data, setData] = useState<any>();
  const [total_money, setData_money] = useState<any>("0");
  const [total_money_service, setData_service] = useState<any>("0");
  const [total_money_room, setData_room] = useState<any>("0");
  const [typeSearch, setType] = useState<any>("month");
  const [typeSearchArr, setTypeArr] = useState<any>(false);
  const [date_start, setDateStart] = useState("");
  const [date_end, setDateEnd] = useState("");
  const [valueDate, setValueDate] = useState<string>(
    dayjs().format("MM - YYYY")
  );
  const [dataChart, setDataChart] = useState<any>();
  const [tbTime, setTbTime] = useState<any>(dayjs().year());
  const [traCuu, setTraCuu] = useState<any>();
  const onChangeDateStart = (value: Dayjs | null, dateString: string) => {
    setDateStart(dateString);
  };
  const onChangeDateEnd = (value: Dayjs | null, dateString: string) => {
    setDateEnd(dateString);
  };
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    setValueDate(dateString);
    setTraCuu({
      timeline: typeSearch,
      year: date?.year(),
      month: Number(date?.month()) + 1,
    });
  };
  const handleSelect = () => {
    if (valueDate === "") {
      message.error("Vui lòng nhập lại thời gian khi thay đổi trạng thái");
      return;
    }
    if (traCuu) {
      setTypeArr(false);
      setTbTime({
        chuKi: typeSearch,
        time: valueDate,
      });
      getRevenueAll(traCuu).then((fetchdata: any) => {
        if (fetchdata?.data?.error) {
          message.error(fetchdata?.data?.error);
          setData({
            quantity_payment: 0,
            total_money: 0,
            total_money_room: 0,
            total_money_service: 0,
          });
          setDataChart(
            typeSearch === "month"
              ? fetchdata?.data?.dailyRevenue
              : fetchdata?.data?.monthlyRevenue
          );
        } else {
          setData(fetchdata?.data);
          setDataChart(
            typeSearch === "month"
              ? fetchdata?.data?.dailyRevenue
              : fetchdata?.data?.monthlyRevenue
          );
        }
      });
    } else {
      message.error("Vui lòng nhập lại thời gian khi thay đổi kiểu tra cứu");
      return;
    }
  };
  const handleSelectDay = () => {
    if (!date_start) {
      message.error("Vui lòng chọn ngày bắt đầu !");
    } else if (!date_end) {
      message.error("Vui lòng chọn ngày kết thúc !");
    } else {
      setTypeArr(true);
      const newData = {
        timeline: "day",
        start: date_start,
        end: date_end,
      };
      getRevenueAll(newData).then((fetchdata: any) => {
        if (fetchdata?.data?.error) {
          message.error(fetchdata?.data?.error);
          setData({
            quantity_payment: 0,
            total_money: 0,
            total_money_room: 0,
            total_money_service: 0,
          });
          setDataChart(
            newData.timeline === "day"
              ? fetchdata?.data?.dailyRevenue
              : fetchdata?.data?.monthlyRevenue
          );
        } else {
          setData(fetchdata?.data);
          setDataChart(
            newData.timeline === "day"
              ? fetchdata?.data?.dailyRevenue
              : fetchdata?.data?.monthlyRevenue
          );
        }
      });
    }
  };
  useEffect(() => {
    const currentTime = new Date();
    if (data) {
      const total_money =
        Number(data?.total_money)
          ?.toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0;
      const total_money_room =
        Number(data?.total_money_room)
          ?.toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0;
      const total_money_service =
        Number(data?.total_money_service)
          ?.toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0;
      setData_money(total_money);
      setData_room(total_money_room);
      setData_service(total_money_service);
    } else if (!data) {
      const dateData = {
        timeline: "month",
        year: currentTime?.getFullYear(),
        month: currentTime?.getMonth() + 1,
      };
      setTbTime({
        chuKi: typeSearch,
        time: valueDate,
      });
      getRevenueAll(dateData).then((fetchdata: any) => {
        if (fetchdata?.data?.error) {
          message.error(fetchdata?.data?.error);
          setData({
            quantity_payment: 0,
            total_money: 0,
            total_money_room: 0,
            total_money_service: 0,
          });
          if (typeSearch === "month") {
            setDataChart(fetchdata?.data?.dailyRevenue);
          } else {
            setDataChart(fetchdata?.data?.monthlyRevenue);
          }
        } else {
          setData(fetchdata?.data);
          if (typeSearch === "month") {
            setDataChart(fetchdata?.data?.dailyRevenue);
          } else {
            setDataChart(fetchdata?.data?.monthlyRevenue);
          }
        }
      });
    }
  }, [data]);
  const ContentRechart = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className="box-border rounded border-2 bg-slate-300 px-[10px]">
          <h4>{`${
            typeSearch === "month" ? `Ngày ${label}` : `Tháng ${label}`
          }`}</h4>
          <h4>{`${Number(payload[0]?.value)
            ?.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}(VNĐ)`}</h4>
        </div>
      );
    }
  };
  const DataName = () => {
    return (
      <div className="text-center mx-[42%] flex gap-4 w-[200px]">
        <div className="pt-1">
          <svg width="14" height="14" viewBox="0 0 32 32">
            <path
              strokeWidth="4"
              fill="none"
              stroke="#82ca9d"
              d="M0,16h10.666666666666666
            A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16
            H32M21.333333333333332,16
            A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16"
            ></path>
          </svg>
        </div>
        <div>Thông tin doanh thu</div>
      </div>
    );
  };
  const setTypeChange = (type: string) => {
    setType(type);
    setValueDate("");
  };
  return (
    <>
      <div className="mb-[25px] mt-[-30px] text-2xl">
        Thống kê tổng doanh thu
      </div>

      <div className="flex gap-[40px] ml-[4%]">
        <div className="flex text-center">
          <DatePicker
            style={{ width: 160 }}
            onChange={onChangeDateStart}
            placeholder="Ngày bắt đầu"
            format={"DD-MM-YYYY"}
          />
          <div className="px-[10px] mt-[4px]">đến</div>
          <DatePicker
            style={{ width: 160 }}
            onChange={onChangeDateEnd}
            placeholder="Ngày kết thúc"
            format={"DD-MM-YYYY"}
          />
        </div>
        <Button onClick={() => handleSelectDay()}>Tra cứu</Button>
      </div>
      <div className="flex gap-10 ml-[4%] mt-[5%]">
        <div>
          <Space direction="vertical" size={12}>
            <div className="flex gap-[40px]">
              <Select value={typeSearch} onChange={(e) => setTypeChange(e)}>
                <Option value="month">Month</Option>
                <Option value="year">Year</Option>
              </Select>
              <DatePicker
                picker={typeSearch}
                onChange={onChange}
                defaultValue={dayjs(
                  `${valueDate}`,
                  `${typeSearch === "month" ? "MM - YYYY" : "YYYY"}`
                )}
                format={`${typeSearch === "month" ? "MM - YYYY" : "YYYY"}`}
                className="w-[100px]"
              />
              <Button onClick={() => handleSelect()}>Tra cứu</Button>
            </div>
          </Space>
          <div className="py-5">
            <div className="text-2xl font-bold">Doanh thu</div>
            <div className="py-5">
              <div>Tổng doanh thu :</div>
              <div>{total_money}</div>
            </div>
            <div className="">
              <div>Doanh thu phòng :</div>
              <div>{total_money_room}</div>
            </div>
            <div className="py-5">
              <div>Doanh thu dịch vụ :</div>
              <div>{total_money_service}</div>
            </div>
            <div>
              <div>
                Chu kì :{" "}
                {typeSearchArr === true
                  ? `Khoảng thời gian`
                  : `${tbTime.chuKi === "month" ? "Theo tháng" : "Theo năm"}`}
              </div>
              <div className="py-2">
                Thời gian :{" "}
                {typeSearchArr === true
                  ? `${date_start + " đến " + date_end}`
                  : `${tbTime?.time}`}
              </div>
              <div>Số hoá đơn : {data?.quantity_payment}</div>
            </div>
          </div>
        </div>
        <div className="ml-[30px] mt-[50px]">
          <LineChart
            width={750}
            height={350}
            data={dataChart}
            margin={{
              top: 10,
              left: 20,
              right: 30,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={`${tbTime.chuKi === "year" ? "month" : "date"}`}
              tickFormatter={(value) =>
                `${tbTime.chuKi === "year" ? `Tháng ${value}` : `${value}`}`
              }
            />
            <YAxis
              axisLine={false}
              domain={[0, Number(data?.total_money)]}
              tickCount={20}
              tickSize={0}
              height={600}
              tickFormatter={(value) =>
                `${Number(value)
                  ?.toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
              }
              padding={{}}
            />
            <Tooltip content={<ContentRechart />} />
            <Legend content={<DataName />} />
            <Line type="monotone" dataKey="total_money" stroke="#82ca9d" />
          </LineChart>
        </div>
      </div>
    </>
  );
};

export default Chart;
