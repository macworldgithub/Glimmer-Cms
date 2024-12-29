import React from "react";
import { Popover, Badge, Avatar } from "antd";
import { BellOutlined } from "@ant-design/icons"; // Import the Bell icon

const Bell = () => {
  const content = (
    <div>
      <p>You have 3 new notifications</p>
      <p>View all notifications</p>
    </div>
  );
  return (
    <Popover content={content} title="Notifications" trigger="click">
      <Badge count={5}>
        <Avatar
          size="large"
          icon={<BellOutlined style={{ color: "black" }} />} // Bell icon
          style={{ cursor: "pointer", backgroundColor: "white" }} // Add a pointer cursor
        />
      </Badge>
    </Popover>
  );
};

export default Bell;
