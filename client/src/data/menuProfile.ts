// đây là data của FE, không cần lưu vào db

import { BiSolidDiscount } from "react-icons/bi";
import { AiOutlineProfile, AiOutlineGift } from "react-icons/ai";

export const Profile = [
  {
    title: "Quản lý tài khoản",
    url: "account",
    Icon: AiOutlineProfile,
    list: [
      {
        name: "Đổi mật khẩu",
        url: "change-password",
      },
    ],
  },
  {
    title: "Đơn hàng",
    url: "orders",
    Icon: AiOutlineGift,
  },

  {
    title: "Mã giảm giá của tôi ",
    url: "myVoucher",
    Icon: BiSolidDiscount,
  },
];
