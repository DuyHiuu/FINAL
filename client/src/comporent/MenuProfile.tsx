import { Link } from "react-router-dom";

import { IconType } from "react-icons";

type MenuItemProps = {
  label: string;
  icon?: IconType;
  active?: boolean;
  menuDrop?: IProfileList[] | undefined;
  onClick: () => void;
};

export interface IProfile {
  title: string;
  url: string;
  Icon: IconType;
  list?: IProfileList[];
}

export interface IProfileList {
  name: string;
  url: string;
}

const MenuItem = ({
  label,
  icon: Icon,
  active,
  onClick,
  menuDrop,
}: MenuItemProps) => {
  console.log(label);

  return (
    <>
      <div className={`${menuDrop ? "border-b" : ""}`}>
        <div
          onClick={onClick}
          className={`px-4 z-10 py-3  transition font-semibold flex
          ${Icon ? `text-base` : ``}
          ${active ? `text-rose-500` : ``}
          ${menuDrop ? "flex flex-col" : ""}
        `}
        >
          <div className="flex gap-3">
            {Icon && <Icon size={25} />}
            ok
          </div>

          {menuDrop &&
            menuDrop?.map((item) => (
              <div
                key={item.name}
                className="text-gray-500 hover:text-rose-500 transition py-3 ml-8"
              >
                <Link to={`/profile/${item.url}`} className="font-normal">
                  {item.name}
                </Link>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default MenuItem;
