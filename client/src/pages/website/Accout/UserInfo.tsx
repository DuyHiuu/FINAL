import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Nếu sử dụng link chuyển trang

const UserInfo = ({ onEdit }) => {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");

    useEffect(() => {
        const nameFromStorage = localStorage.getItem("name");
        const emailFromStorage = localStorage.getItem("email");
        const phoneFromStorage = localStorage.getItem("phone");

        setUserName(nameFromStorage || "");
        setUserEmail(emailFromStorage || "");
        setUserPhone(phoneFromStorage || "");
    }, []);

    return (
        <div className="p-4 border rounded-md shadow-md space-y-6">
            {/* Thông tin cá nhân */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold mb-2">Thông tin cá nhân</h3>
                    <ul>
                        <li><strong>Tên:</strong> {userName}</li>
                        <li><strong>Email:</strong> {userEmail}</li>
                        <li><strong>Số điện thoại:</strong> {userPhone}</li>
                    </ul>
                </div>
                <button onClick={onEdit} className="text-blue-500 hover:underline">Sửa</button>
            </div>
        </div>
    );
};

export default UserInfo;

