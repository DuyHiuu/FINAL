import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import dayjs from "dayjs";
import type { DatePickerProps, TimePickerProps } from "antd";
import {
  useTop3RoomMutation,
  useTop3ServiceMutation,
} from "../../../../api/statistics";
import {
  Space,
  DatePicker,
  DatePickerProps,
  Select,
  Button,
  message,
} from "antd";
import { useEffect, useState } from "react";
import Chart from "../home/Chart";
const { RangePicker } = DatePicker;
const { Option } = Select;
const HomeAdmin = () => {
  const [Top3Rooms] = useTop3RoomMutation();
  const [Top3Services] = useTop3ServiceMutation();
  const [dataRooms, setDataRooms] = useState<any>();
  const [dataServices, setDataServices] = useState<any>();
  const [valueDateRoom, setValueDateRoom] = useState<any>(dayjs().year());
  const [valueDateService, setValueDateService] = useState<any>(dayjs().year());
  const [dataChartRooms, setDataChartRooms] = useState<any>();
  const [dataChartServices, setDataChartServices] = useState<any>();
  const [typeSearchRoom, setTypeSearchRoom] = useState<any>("year");
  const [maxChartRoom, setMaxChartRoom] = useState<number>();
  const [traCuuRoom, setTraCuuRoom] = useState<any>();
  const [typeSearchService, setTypeSearchService] = useState<any>("year");
  const [maxChartService, setMaxChartService] = useState<number>();
  const [traCuuService, setTraCuuService] = useState<any>();
  const [convert, setConvert] = useState<any>(0);
  const onChangeRoom: DatePickerProps["onChange"] = (date, dateString) => {
    setValueDateRoom(dateString);
    setTraCuuRoom({
      timeline: typeSearchRoom,
      year: date?.year(),
      month: Number(date?.month()) + 1,
    });
  };
  const onChangeService: DatePickerProps["onChange"] = (date, dateString) => {
    setValueDateService(dateString);
    setTraCuuService({
      timeline: typeSearchService,
      year: date?.year(),
      month: Number(date?.month()) + 1,
    });
  };
  const handleSelectRooms = () => {
    if (valueDateRoom === null) {
      message.error("Vui lòng nhập lại thời gian khi thay đổi trạng thái");
      return;
    }
    if (traCuuRoom) {
      Top3Rooms(traCuuRoom).then((fetchdata: any) => {
        if (fetchdata?.data?.message) {
          message.error(fetchdata?.data?.message);
          setDataRooms({
            size_name: "",
            total_payments_sold: 0,
            total_revenue: 0,
          });
          setDataChartRooms(fetchdata?.data);
        } else {
          setDataRooms(fetchdata?.data);
          setMaxChartRoom(fetchdata?.data[0]?.total_revenue);
          setDataChartRooms(fetchdata?.data);
        }
      });
    }
  };

  const handleSelectServices = () => {
    if (valueDateService === null) {
      message.error("Vui lòng nhập lại thời gian khi thay đổi trạng thái");
      return;
    }
    if (traCuuService) {
      Top3Services(traCuuService).then((fetchdata: any) => {
        if (fetchdata?.data?.message) {
          message.error(fetchdata?.data?.message);
          setDataServices({
            name: "",
            total_quantity_sold: 0,
            total_revenue: 0,
          });
          setDataChartServices(fetchdata?.data);
        } else {
          setDataServices(fetchdata?.data);
          setMaxChartService(fetchdata?.data[0]?.total_revenue);
          setDataChartServices(fetchdata?.data);
        }
      });
    }
  };

  useEffect(() => {
    const currentTime = new Date();
    const dateData = {
      timeline: "year",
      year: currentTime?.getFullYear(),
      month: currentTime?.getMonth() + 1,
    };
    if (!dataRooms) {
      Top3Rooms(dateData).then((fetchdata: any) => {
        if (fetchdata?.data?.message) {
          // message.error(fetchdata?.data?.message);
          setDataRooms({
            size_name: "",
            total_payments_sold: 0,
            total_revenue: 0,
          });
          setDataChartRooms(fetchdata?.data);
        } else {
          setDataRooms(fetchdata?.data);
          setMaxChartRoom(fetchdata?.data[0]?.total_revenue);
          setDataChartRooms(fetchdata?.data);
        }
      });
    }
    if (!dataServices) {
      Top3Services(dateData).then((fetchdata: any) => {
        if (fetchdata?.data?.message) {
          // message.error(fetchdata?.data?.message);
          setDataServices({
            name: "",
            total_quantity_sold: 0,
            total_revenue: 0,
          });
          setDataChartServices(fetchdata?.data);
        } else {
          setDataServices(fetchdata?.data);
          setMaxChartService(fetchdata?.data[0]?.total_revenue);
          setDataChartServices(fetchdata?.data);
        }
      });
    }
  }, [dataRooms, dataServices]);
  const ContentRechart = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className="box-border rounded border-2 bg-slate-300 px-[10px]">
          <h4>{`${label}`}</h4>
          <h4>{`${Number(payload[0]?.value)
            ?.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}(VNĐ)`}</h4>
        </div>
      );
    }
  };
  const Content = ({ data }: { data: string }) => {
    return <div className="pl-[48%] pb-[50px]">{data}</div>;
  };
  const setTypeRoom = (type: string) => {
    setTypeSearchRoom(type);
    setValueDateRoom(null);
  };
  const setTypeService = (type: string) => {
    setTypeSearchService(type);
    setValueDateService(null);
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Bảng xếp hạng</h1>
        </div>
        <div>
          <div className="mt-[20px] flex flex-col gap-10 ">
            <div>
              <div className="mb-[25px] text-2xl">Top 3 Room </div>
              <div className="mb-[40px]">
                <Space direction="vertical" size={12}>
                  <div className="flex gap-[40px]">
                    <Select
                      value={typeSearchRoom}
                      onChange={(e) => setTypeRoom(e)}
                    >
                      <Option value="month">Month</Option>
                      <Option value="year">Year</Option>
                    </Select>
                    <DatePicker
                      picker={typeSearchRoom}
                      onChange={onChangeRoom}
                      defaultValue={dayjs(
                        `${valueDateRoom}`,
                        `${typeSearchRoom === "month" ? "MM / YYYY" : "YYYY"}`
                      )}
                      format={`${
                        typeSearchRoom === "month" ? "MM / YYYY" : "YYYY"
                      }`}
                      className="w-[100px]"
                    />
                    <Button onClick={() => handleSelectRooms()}>Tra cứu</Button>
                  </div>
                </Space>
              </div>
              {dataChartRooms && dataChartRooms.length > 0 ? (
                <BarChart
                  width={400}
                  height={300}
                  data={dataChartRooms}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis
                    dataKey="size_name"
                    tickFormatter={() => ``}
                    padding={{ left: 20 }}
                  />
                  <YAxis
                    domain={[0, Number(maxChartRoom)]}
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
                  <Tooltip content={<ContentRechart label={`description`} />} />
                  <Legend content={<Content data="Rooms" />} />
                  <Bar dataKey="total_revenue" fill="#8884d8" />
                </BarChart>
              ) : (
                <div
                  className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                  </span>
                </div>
              )}
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm text-center">
                <thead className="ltr:text-left rtl:text-right bg-gray-100">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      STT
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      Tên Phòng
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      Tổng lượng phòng được đặt
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      Tổng doanh thu (VNĐ)
                    </th>
                  </tr>
                </thead>
                {dataRooms && dataRooms.length > 0 ? (
                  <tbody className="divide-y divide-gray-200">
                    {dataRooms.map((value: any, index: number) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                          {value?.size_name?.length > 20
                            ? value.description.substring(0, 30) + "..."
                            : value.size_name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {value?.total_payments_sold}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {Number(value?.total_revenue)
                            ?.toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td
                        colSpan={4}
                        className="flex items-center justify-center h-40 text-xl text-gray-500"
                      >
                        Thông tin trống
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
            <div></div>
            <div>
              <div className="mb-[25px] text-2xl">Top 3 dịch vụ </div>
              <div className="mb-[40px]">
                <Space direction="vertical" size={12}>
                  <div className="flex gap-[40px]">
                    <Select
                      value={typeSearchService}
                      onChange={(e) => setTypeService(e)}
                    >
                      <Option value="month">Month</Option>
                      <Option value="year">Year</Option>
                    </Select>
                    <DatePicker
                      picker={typeSearchService}
                      onChange={onChangeService}
                      defaultValue={dayjs(
                        `${valueDateService}`,
                        `${
                          typeSearchService === "month" ? "MM / YYYY" : "YYYY"
                        }`
                      )}
                      format={`${
                        typeSearchService === "month" ? "MM / YYYY" : "YYYY"
                      }`}
                      className="w-[100px]"
                    />
                    <Button onClick={() => handleSelectServices()}>
                      Tra cứu
                    </Button>
                  </div>
                </Space>
              </div>
              {dataChartServices && dataChartServices.length > 0 ? (
                <BarChart
                  width={400}
                  height={300}
                  data={dataChartServices}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis
                    dataKey="name"
                    tickFormatter={() => ``}
                    padding={{ left: 20 }}
                  />
                  <YAxis
                    domain={[0, Number(maxChartService)]}
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
                  <Tooltip content={<ContentRechart label={`name`} />} />
                  <Legend content={<Content data="Services" />} />
                  <Bar dataKey="total_revenue" fill="#8884d8" />
                </BarChart>
              ) : (
                <div
                  className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-10 mt-[30px]">
            <div></div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm text-center">
                <thead className="ltr:text-left rtl:text-right bg-gray-100">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      STT
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      Tên Dịch vụ
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      Số lượng được đặt
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      Tổng doanh thu (VNĐ)
                    </th>
                  </tr>
                </thead>
                {dataServices && dataServices.length > 0 ? (
                  <tbody className="divide-y divide-gray-200">
                    {dataServices.map((value: any, index: number) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-900">
                          {value?.name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {value?.total_quantity_sold}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                          {Number(value?.total_revenue)
                            ?.toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td
                        colSpan={4}
                        className="flex items-center justify-center h-40 text-xl text-gray-500"
                      >
                        Thông tin trống
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>

      <Chart />
    </>
  );
};

export default HomeAdmin;
