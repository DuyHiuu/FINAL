import React from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const products = [
    {
      id: 1,
      name: "Áo Thun Basic",
      price: "200.000 VND",
      quantity: 50,
      status: "Còn hàng",
      image: "https://via.placeholder.com/100", // Hình ảnh placeholderr
    },
    {
      id: 2,
      name: "Quần Jean Slimfit",
      price: "400.000 VND",
      quantity: 30,
      status: "Hết hàng",
      image: "https://via.placeholder.com/100", // Hình ảnh placeholder
    },
    {
      id: 3,
      name: "Giày Sneaker",
      price: "1.200.000 VND",
      quantity: 20,
      status: "Còn hàng",
      image: "https://via.placeholder.com/100", // Hình ảnh placeholder
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Danh Sách Sản Phẩm</h1>
        <Link to="/admin/add" className="bg-blue-600 text-white px-4 py-2 rounded shadow">
          Thêm Sản Phẩm
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">STT</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Hình Ảnh</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Tên Sản Phẩm</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Giá</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Số Lượng</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Trạng Thái</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">
                  <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
                </td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.price}</td>
                <td className="px-4 py-2">{product.quantity}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      product.status === "Còn hàng"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/admin/edit`} 
                      //  {`/admin/edit/${product.id}`}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
