import { LockClosedIcon, ShoppingCartIcon, TagIcon, UserIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserInfo from "./UserInfo";
import EditUserInfo from "./EditUserInfo"; // Import form chỉnh sửa thông tin người dùng

const AccountProfile = () => {
    const [currentUser, setCurrentUser] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState("greeting"); // Tab mặc định là "Xin chào"
    const [isEditing, setIsEditing] = useState(false); // State để điều khiển hiển thị form EditUserInfo
    const token = localStorage.getItem("token");
    const [userName, setUserName] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const nameFromStorage = localStorage.getItem("name");
        if (token) {
            setUserName(nameFromStorage || "");
        }
    }, [token]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (token) {
                try {
                    const response = await fetch("/api/user", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    setCurrentUser(data);
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                }
            }
        };

        fetchUserData();
    }, [token]);

    const handleEdit = () => {
        setIsEditing(true); // Kích hoạt form chỉnh sửa khi nhấn "Sửa"
    };

    const handleSave = () => {
        setIsEditing(false); // Sau khi lưu, trở lại chế độ xem thông tin
    };

    const renderContent = () => {
        if (isEditing) {
            return (
                <div className="flex justify-center items-center min-h-[400px]">
                    <EditUserInfo onSave={handleSave} />
                </div>
            ); // Hiển thị form chỉnh sửa, căn giữa
        }
    
        switch (activeTab) {
            case "greeting":
                return <h3 className="text-lg">Xin chào, {userName}!</h3>;
            case "infor":
                return currentUser ? (
                    <UserInfo onEdit={handleEdit} />
                ) : (
                    <p className="text-gray-700"><UserInfo onEdit={handleEdit} /></p>
                );
            case "password":
                return (
                    <div>
                        <h4 className="text-lg">Quản lý mật khẩu</h4>
                        <p className="text-gray-700">Chức năng này cho phép bạn thay đổi mật khẩu của mình.</p>
                        <Link to="/profile/change-password" className="text-rose-500 hover:underline">
                            Thay đổi mật khẩu
                        </Link>
                    </div>
                );
            case "orders":
                return (
                    <div>
                        <h4 className="text-lg">Đơn hàng của bạn</h4>
                        <p className="text-gray-700">Danh sách đơn hàng sẽ được hiển thị ở đây.</p>
                    </div>
                );
            case "coupons":
                return (
                    <div>
                        <h4 className="text-lg">Mã giảm giá</h4>
                        <p className="text-gray-700">Danh sách mã giảm giá của bạn sẽ được hiển thị ở đây.</p>
                    </div>
                );
            default:
                return null;
        }
    };
    

    return (
        <div style={{ marginTop: "160px" }} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Thông tin người dùng</h2>

            <div className="flex">
                {/* Navigation Menu */}
                <div className="w-1/3 border-r pr-4">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <UserIcon className="h-5 w-5 mr-2" />
                        Xin chào, {userName}
                    </h3>
                    <button
                        className={`flex items-center py-2 px-4 rounded-md mb-2 w-full ${activeTab === "infor" ? "bg-rose-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                        onClick={() => {
                            setActiveTab("infor"); // Cập nhật tab hoạt động
                        }}
                    >
                        <LockClosedIcon className="h-5 w-5 mr-2" />
                        Quản lý tài khoản
                    </button>
                    <button
                        className={`flex items-center py-2 px-4 rounded-md mb-2 w-full ${activeTab === "orders" ? "bg-rose-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                        onClick={() => {
                            setActiveTab("orders"); // Cập nhật tab hoạt động
                            navigate("/history1"); // Chuyển hướng đến trang /history1
                        }}
                    >
                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                        Đơn hàng
                    </button>
                    <button
                        className={`flex items-center py-2 px-4 rounded-md mb-2 w-full ${activeTab === "coupons" ? "bg-rose-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                        onClick={() => setActiveTab("coupons")}
                    >
                        <TagIcon className="h-5 w-5 mr-2" />
                        Mã giảm giá
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 pl-4">
                    <div className="border-t pt-4">
                        {renderContent()} {/* Hiển thị nội dung dựa trên activeTab */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountProfile;
