import React from "react";
import { Popover, Avatar } from "antd";

import Profilepic from "../assets/Profile/pic.png";

const Profile = () => {
  const content = (
    <div>
      <p>Username: John Doe</p>
      <p>Email: john.doe@example.com</p>
    </div>
  );
  return (
    <Popover content={content} title="Profile Info" trigger="click">
      <Avatar size={"large"} src={Profilepic} icon="user" />
    </Popover>
  );
};

export default Profile;
