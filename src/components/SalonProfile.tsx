import React, { SetStateAction, Dispatch } from "react";
import { Popover, Avatar, Divider, Modal } from "antd";
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

const SalonProfile: React.FC<PropsProfile> = ({ profile, setProfile }) => {
  const data = useSelector((state: RootState) => state.Login);
  const dispatch = useDispatch();
  console.log(data)
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [showResetOption, setShowResetOption] = React.useState(false);

  const HandleClick = (name: string) => {
    if (name === "logout") {
      dispatch(logout());
    }
  };

  const HandleProfileClick = () => {
    setProfile(true);
  };

  const showModal = () => {
    setIsModalVisible(true);
    setShowResetOption(false); // hide reset option after modal opens
  };

  const handleOk = () => {
    // Password reset logic here
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const toggleResetOption = () => {
    setShowResetOption((prev) => !prev);
  };

  const content = (
    <div className="h-max flex flex-col">
      {/* User Info */}
      <div className="flex items-center w-full p-2">
        <Avatar
          size={"large"}
          src={data.role === "salon" ? data.images[0] : Profilepic}
          icon="user"
        />
        <div className="ml-2">
          <h1 className="text-sm font-medium">{data.salon_name}</h1>
          <h1 className="text-xs font-light text-gray-500">Salon</h1>
        </div>
      </div>
      <Divider className="my-1" />

      {/* Salon Profile */}
      <div
        onClick={HandleProfileClick}
        className="flex items-center p-2 cursor-pointer hover:bg-gray-100 transition-colors"
      >
        <UserOutlined className="text-base mr-2" />
        <h2 className="text-sm font-normal">Salon Profile</h2>
      </div>
      <Divider className="my-1" />

      {/* Settings + Toggle Reset Password */}
      <div className="flex flex-col">
        <div
          onClick={toggleResetOption}
          className="flex items-center p-2 cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <SettingOutlined className="text-base mr-2" />
          <h2 className="text-sm font-normal">Settings</h2>
        </div>

        {showResetOption && (
          <div
            onClick={showModal}
            className="ml-6 pl-2 py-1 text-sm text-black cursor-pointer"
          >
            Reset Password
          </div>
        )}
      </div>
      <Divider className="my-1" />

      {/* Logout */}
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
    <>
      <Popover content={content} title="Salon Profile Info" trigger="click">
        <Avatar
          size={"large"}
          src={data.role === "salon" ? data.store_image : Profilepic}
          icon="user"
        />
      </Popover>

      {/* Reset Password Modal */}
      <Modal
        title="Reset Password"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="Current Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </Modal>
    </>
  );
};

export default SalonProfile;
