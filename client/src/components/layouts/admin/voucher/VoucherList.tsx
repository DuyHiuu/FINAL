import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Table, Input, Button, Popconfirm, message, Pagination } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Import icons
import useFetchVoucher from "../../../../api/useFetchVoucher";

const VoucherList = () => {
  const { vouchers, setVouchers, loading } = useFetchVoucher();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vouchersPerPage] = useState(5); // Số lượng voucher trên mỗi trang

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  // Hàm lọc voucher dựa trên tên và mã code
  const filteredVouchers = vouchers?.filter(
    (voucher) =>
      voucher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const indexOfLastVoucher = currentPage * vouchersPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
  const currentVouchers = filteredVouchers?.slice(indexOfFirstVoucher, indexOfLastVoucher);

  const totalPages = Math.ceil(filteredVouchers?.length / vouchersPerPage);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa voucher này?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/vouchers/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        message.success("Voucher đã được xóa thành công");
        setVouchers((prevVouchers) => prevVouchers.filter((voucher) => voucher.id !== id));
      } else {
        const errorData = await response.json();
        console.error("Xóa voucher thất bại:", errorData.message);
        message.error(`Xóa voucher thất bại: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      message.error("Đã xảy ra lỗi khi xóa voucher");
    }
  };

  // Hàm chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Cấu hình cột bảng
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => indexOfFirstVoucher + index + 1, // Tính số thứ tự
    },
    {
      title: "Tên voucher",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (text) => `${text.toLocaleString("vi-VN")} VND`, // Định dạng tiền tệ
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          {/* Sửa voucher */}
          <Link to={`/admin/vouchers/${record.id}`} className="text-yellow-500">
            <EditOutlined style={{ fontSize: 20 }} />
          </Link>

          {/* Xóa voucher */}
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa voucher này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              style={{ border: "none" }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh Sách Voucher</h1>
        <Link
          to="/admin/vouchers/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Thêm Voucher
        </Link>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="mb-4">
        <Input
          placeholder="Tìm kiếm theo tên hoặc mã voucher"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <Table
            columns={columns}
            dataSource={currentVouchers}
            rowKey="id"
            pagination={false} // Tắt phân trang trong Table
          />
        </div>
      )}

      {/* Phân trang */}
      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          pageSize={vouchersPerPage}
          total={filteredVouchers?.length}
          onChange={handlePageChange}
          showSizeChanger={false} // Ẩn chức năng thay đổi số lượng item trên mỗi trang
        />
      </div>
    </div>
  );
};

export default VoucherList;
