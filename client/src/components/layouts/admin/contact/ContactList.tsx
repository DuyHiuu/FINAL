import React, { useState } from "react";
import { Link } from "react-router-dom";
import useFetchContacts from "../../../../api/useFetchContacts";
import { FaSearch } from "react-icons/fa";

const ContactList = () => {
  const { contacts, loading, error } = useFetchContacts();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(5);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter) =>{
    setFilterBy(filter);
  };

  const filteredContacts = contacts?.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone_number.includes(searchTerm) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts?.slice(indexOfFirstContact, indexOfLastContact);

  const totalPages = Math.ceil(filteredContacts?.length / contactsPerPage);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa địa chỉ liên hệ này không?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/contacts/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Đã xóa liên hệ thành công");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Xóa không thành công:", errorData.message);
        alert(`Xóa không thành công: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Đã xảy ra lỗi khi xóa liên hệ");
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Danh sách liên hệ</h1>
        {/* <Link
          to="/admin/contacts/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Add Contact
        </Link> */}
      </div>

      {/* Thanh tìm kiếm và lọc */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            className="border p-2 w-full rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tìm kiếm theo name, email, phone hoặc message"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute top-3 left-3 text-gray-500" />
        </div>

        {/* Nút lọc */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFilterChange("content")}
            className={`px-4 py-2 rounded-lg transition ${filterBy === "name" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-400 focus:ring-2 focus:ring-blue-500`}>
            Họ tên
          </button>
          <button
            onClick={() => handleFilterChange("user")}
            className={`px-4 py-2 rounded-lg transition ${filterBy === "email" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-400 focus:ring-2 focus:ring-blue-500`}>
            Email
          </button>
          <button
            onClick={() => handleFilterChange("created_at")}
            className={`px-4 py-2 rounded-lg transition ${filterBy === "phone" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-400 focus:ring-2 focus:ring-blue-500`}>
            Số điện thoại
          </button>
        </div>
    </div>
      
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div> // Hiển thị thông báo lỗi
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          {/* Danh sách bình luận dưới dạng bảng */}
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">STT</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Họ tên</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Số điện thoại</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Tin nhắn</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {Array.isArray(currentContacts) && currentContacts.length > 0 ? (
                currentContacts.map((contact, index) => (
                  <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 border-b">{indexOfFirstContact + index + 1}</td>
                    <td className="px-4 py-3 border-b">{contact.name}</td>
                    <td className="px-4 py-3 border-b">{contact.email}</td>
                    <td className="px-4 py-3 border-b">{contact.phone_number}</td>
                    <td className="px-4 py-3 border-b">{contact.message}</td>
                    <td className="px-4 py-3 border-b">
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/admin/contacts/${contact.id}`}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition duration-200"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Không tìm thấy liên hệ nào!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 mx-1 rounded-lg ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContactList;
