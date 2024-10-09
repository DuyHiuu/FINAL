import React from "react";
import { Link } from "react-router-dom";
import useFetchSize from "../../../../api/useFetchSize";

const SizeList = () => {
  const { sizes } = useFetchSize(); // Sử dụng mảng sizes

  console.log(sizes); // Kiểm tra dữ liệu trả về trong console

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Danh Sách Size</h1>
        <Link
          to="/admin/addsizes"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Thêm Size
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                STT
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Tên size
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Số lượng
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Miêu tả
              </th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody>
            {sizes?.length > 0 ? (
              sizes.map((size, index) => (
                <tr key={size.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{size.name}</td>
                  <td className="px-4 py-2">{size.quantity}</td>
                  <td className="px-4 py-2">{size.description}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/admin/edit/${size.id}`} // Sửa đường dẫn
                        className="bg-yellow-500 text-white px-3 py-1 rounded shadow hover:bg-yellow-600"
                      >
                        Sửa
                      </Link>
                      <button className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-2 text-center text-gray-600"
                >
                  Không có size nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SizeList;
