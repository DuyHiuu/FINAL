import React, { useState } from "react";
import { Link } from "react-router-dom";
import useFetchContacts from "../../../../api/useFetchContacts";

const ContactList = () => {
  const { contacts, loading, error } = useFetchContacts();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(5);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
        <h1 className="text-3xl font-bold text-gray-800">Contact List</h1>
        <Link
          to="/admin/contacts/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Add Contact
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo name, email, phone hoặc message"
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div> // Hiển thị thông báo lỗi
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">STT</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Phone Number</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Message</th>
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
                    No contacts found
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
