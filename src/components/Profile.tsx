import React, { SetStateAction, Dispatch } from "react";
import { Popover, Avatar, Divider } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Profilepic from "../assets/Profile/pic.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../slices/loginSlice";

interface PropsProfile {
  profile: boolean;
  setProfile: Dispatch<SetStateAction<boolean>>;
}

const Profile: React.FC<PropsProfile> = ({ profile, setProfile }) => {
  const data = useSelector((state: RootState) => state.Login);
  const dispatch = useDispatch();
  const HandleClick = (name: string) => {
    if (name === "logout") {
      dispatch(logout());
    }
  };

  const HandleProfileClick = () => {
    setProfile(true);
  };

  const content = (
    <div className="h-max flex flex-col">
      {/* User Info Section */}
      <div className="flex items-center w-full p-2">
        <Avatar
          size={"large"}
          src={data.role === "store" ? data.store_image : Profilepic}
          icon="user"
        />
        <div className="ml-2">
          <h1 className="text-sm font-medium">{data.store_name}</h1>
          <h1 className="text-xs font-light text-gray-500">Admin</h1>
        </div>
      </div>
      <Divider className="my-1" />

      {/* Profile Section */}
      <div
        onClick={HandleProfileClick}
        className="flex items-center p-2 cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <UserOutlined className="text-base mr-2" />
        <h2 className="text-sm font-normal">Profile</h2>
      </div>
      <Divider className="my-1" />

      {/* Settings Section */}
      <div className="flex items-center p-2 cursor-pointer hover:bg-gray-100 transition-colors">
        <SettingOutlined className="text-base mr-2" />
        <h2 className="text-sm font-normal">Settings</h2>
      </div>
      <Divider className="my-1" />

      {/* Logout Section */}
      <div
        onClick={() => HandleClick("logout")}
        className="flex items-center p-2 cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <LogoutOutlined className="text-base mr-2 text-red-500" />
        <h2 className="text-sm font-normal text-red-500">Logout</h2>
      </div>
    </div>
  );

  return (
    <Popover content={content} title="Profile Info" trigger="click">
      <Avatar
        size={"large"}
        src={data.role === "store" ? data.store_image : Profilepic}
        icon="user"
      />
    </Popover>
  );
};

export default Profile;
