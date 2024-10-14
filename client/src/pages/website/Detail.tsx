import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetchServices from "../../api/useFetchServices";

const Detail = () => {

  const { service } = useFetchServices();


  const smallImageSrcs = [
    "/images/anh9.webp", // Đường dẫn ảnh nhỏ 1
    "/images/anh10.webp", // Đường dẫn ảnh nhỏ 2
    "/images/anh2.webp", // Đường dẫn ảnh nhỏ 3
    "/images/anh11.webp", // Đường dẫn ảnh nhỏ 4
  ];
  const row = [
    {
      icon: (
        <img
          src="/images/icon1.jpg" // Đường dẫn icon chó mèo
          alt="dog-cat-icon"
          className="h-8 w-8"
        />
      ),
    },
  ];

  const API_URL = "http://localhost:8000/api";

  const { id } = useParams();

  const [room, setRoom] = useState<any>();
  //hàm để get dữ liệu
  useEffect(() => {
    try {
      // fetroom để get dữ liệu
      const fetroom = async () => {
        const res = await fetch(`${API_URL}/rooms/${id}`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`Lỗi: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json(); // Chuyển dữ liệu thành JSON
        setRoom(data); // Lưu dữ liệu vào state
      };
      fetroom();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const addBookingUrl = "http://localhost:8000/api/bookings";

  const [room_id, setRoom_id] = useState(id);
  const [service_ids, setService_ids] = useState<number[] | null>(null);
  const [quantities, setQuantities] = useState<number[] | null>(null);
  const [start_date, setStart_date] = useState('');
  const [end_date, setEnd_date] = useState('');

  // Hàm xử lý khi chọn/deselect dịch vụ
  const changeService = (serviceId: number) => {
    setService_ids(prevState => {
      if (!prevState) return [serviceId];
      return prevState.includes(serviceId)
        ? prevState.filter(id => id !== serviceId)
        : [...prevState, serviceId];
    });
  };

  const changeQuantity = (serviceId: number, quantity: number) => {
    setQuantities(prevState => {
      if (!prevState) return [quantity]; // Nếu chưa có giá trị, trả về mảng chứa 1 phần tử
      const updatedQuantities = [...prevState];
      const index = updatedQuantities.findIndex((q, i) => i === serviceId - 1); // index phải là dịch vụ id trừ 1

      if (index !== -1) {
        updatedQuantities[index] = quantity; // Cập nhật số lượng của dịch vụ tương ứng
      } else {
        updatedQuantities.push(quantity); // Thêm mới nếu không có
      }

      return updatedQuantities; // Trả về mảng đã cập nhật
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const safeServiceIds = service_ids?.length ? service_ids : null;
    const safeQuantities = quantities ? Object.values(quantities) : null; // Chuyển object thành mảng

    // Tạo form data để gửi cả text và file ảnh
    const formData = new FormData();
    formData.append('service_ids', JSON.stringify(safeServiceIds));
    formData.append('room_id', room_id);
    formData.append('quantities', JSON.stringify(safeQuantities)); // Sử dụng mảng thay vì object
    formData.append('start_date', start_date);
    formData.append('end_date', end_date);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await fetch(addBookingUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Thành công:', data);
      } else {
        console.error('Lỗi:', response.statusText);
      }
    } catch (error) {
      console.error('Lỗi kết nối API:', error);
    }
  };



  return (
    <div className="container mx-auto p-4 lg:p-8 mt-24">
      {/* Phần hình ảnh */}
      <div className="flex flex-col lg:flex-row mb-8">
        {/* Hình ảnh lớn bên trái */}
        <div className="lg:w-2/3 p-2 h-96">
          <img
            src={room?.img_thumbnail}
            alt="Large"
            className="w-full h-full object-cover rounded-lg shadow"
          />
        </div>

        {/* Hình ảnh nhỏ bên phải */}
        <div className="lg:w-1/3 p-2 flex flex-col">
          <div className="flex mb-2 h-48">
            <img
              src={smallImageSrcs[0]}
              alt="Small 1"
              className="w-1/2 h-full object-cover rounded-lg shadow mr-1"
            />
            <img
              src={smallImageSrcs[1]}
              alt="Small 2"
              className="w-1/2 h-full object-cover rounded-lg shadow ml-1"
            />
          </div>
          <div className="flex h-40">
            <img
              src={smallImageSrcs[2]}
              alt="Small 3"
              className="w-1/2 h-full object-cover rounded-lg shadow mr-1"
            />
            <img
              src={smallImageSrcs[3]}
              alt="Small 4"
              className="w-1/2 h-full object-cover rounded-lg shadow ml-1"
            />
          </div>
        </div>
      </div>

      <form action="" onSubmit={handleSubmit}>

        <input type="hidden" name="room_id" defaultValue={room_id} onChange={(e) => setRoom_id(e.target.value)} />
        {/* Phần thông tin */}
        <div className="flex flex-col lg:flex-row">
          {/* Phần thông tin phòng */}
          <div className="lg:w-2/3 p-4">
            <div className="text-left">
              <strong className="text-5xl">{room?.size_name}</strong>
              <div className="flex items-center mt-10">
                <p className="flex items-center">{room?.statusroom}</p>
              </div>
            </div>
            <h3 className="text-left text-2xl font-semibold mt-10">Dịch vụ kèm thêm</h3>
            <div className="mt-2">
              {service?.map((service: any) => (
                <label className="flex items-center mb-2" key={service.id}>
                  <div>
                    <input
                      name="service_ids"
                      value={service.id}
                      onChange={() => changeService(service.id)}  // Gọi hàm xử lý thay đổi
                      type="checkbox"
                      className="mr-2 appearance-none checked:bg-[#064749] border rounded-full w-4 h-4 cursor-pointer"
                      checked={service_ids?.includes(service.id)}  // Kiểm tra xem dịch vụ có được chọn không
                    />
                    <span className="me-3">{service?.name}</span>

                    <span>
                      x
                      <input
                        className="border ms-3"
                        value={quantities?.[service.id - 1] ?? ''}  // Đảm bảo mảng có chỉ số đúng
                        onChange={(e) => changeQuantity(service.id, parseInt(e.target.value) || 0)}  // Cập nhật số lượng
                        placeholder="Nhập số lượng dịch vụ"
                        type="number"
                        name={`quantities_${service.id}`}
                        id={`quantities_${service.id}`}
                      />
                    </span>
                  </div>
                </label>
              ))}



            </div>

            <h3 className="text-left text-2xl font-semibold mt-10">Mô tả</h3>
            <p className="text-left mt-1">
              {room?.description}
            </p>
          </div>

          {/* Phần thông tin đặt phòngg */}
          <div className="lg:w-1/3 p-4 mt-10 border rounded-lg shadow-lg ml-0 lg:ml-4 bg-[#F2F0F2] h-full">
            <h2 className="text-2xl font-semibold mb-5">{room?.price}/Ngày</h2>

            {/* Ngày vào và Ngày ra nằm ngang */}
            <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-4 mb-4">
              <label className="text-left block w-full lg:w-1/2">
                <strong>Ngày vào</strong>
                <input type="date" name="start_date" value={start_date} className="border p-1 w-full mt-1"
                  onChange={(e) => setStart_date(e.target.value)} />
              </label>
              <label className="text-left block w-full lg:w-1/2">
                <strong>Ngày ra</strong>
                <input type="date" name="end_date" value={end_date} className="border p-1 w-full mt-1"
                  onChange={(e) => setEnd_date(e.target.value)} />
              </label>
            </div>

            <center>
              <button type="submit" className="mt-2 text-white px-10 py-2 rounded-full bg-[#064749]">
                Đặt phòng
              </button>
            </center>

          </div>
        </div>
      </form>
    </div>
  );
};

export default Detail;
