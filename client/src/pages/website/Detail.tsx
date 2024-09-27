import React from "react";

const Detail = () => {
  const largeImageSrc = "/images/anh8.webp"; // Đường dẫn ảnh lớn
  const smallImageSrcs = [
    "/images/anh9.webp", // Đường dẫn ảnh nhỏ 1
    "/images/anh10.webp", // Đường dẫn ảnh nhỏ 2
    "/images/anh2.webp", // Đường dẫn ảnh nhỏ 3
    "/images/anh11.webp", // Đường dẫn ảnh nhỏ 4
  ];

  return (
    <div className="container mx-auto p-8">
      <div className="flex">
        {/* Hình ảnh lớn bên trái */}
        <div className="flex-shrink-0 w-1/2 p-2">
          <img
            src={largeImageSrc}
            alt="Large"
            className="w-full h-auto rounded-lg shadow"
          />
        </div>

        {/* Hình ảnh nhỏ bên phải */}
        <div className="flex flex-col w-1/2 p-2">
          <div className="flex mb-2">
            <img
              src={smallImageSrcs[0]}
              alt="Small 1"
              className="w-1/2 h-auto rounded-lg shadow mr-1"
            />
            <img
              src={smallImageSrcs[1]}
              alt="Small 2"
              className="w-1/2 h-auto rounded-lg shadow ml-1"
            />
          </div>
          <div className="flex mb-2">
            <img
              src={smallImageSrcs[2]}
              alt="Small 3"
              className="w-1/2 h-auto rounded-lg shadow mr-1"
            />
            <img
              src={smallImageSrcs[3]}
              alt="Small 4"
              className="w-1/2 h-auto rounded-lg shadow ml-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
