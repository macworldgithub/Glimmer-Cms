import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { Badge, Popover, List, Button, Avatar } from "antd";
import { BellOutlined } from "@ant-design/icons";
import {
  addNotification,
} from "../slices/notificationSlice";
import {
  markNotificationAsReadAPI,
  markAllNotificationsAsReadAPI,
} from "../api/auth/api"; 

const Bell = () => {
  const notifications = useSelector(
    (state: RootState) => state.Notifications.notifications
  );
  const userId = useSelector((state: RootState) => state.Login._id);
  const dispatch = useDispatch();

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.read).length
    : 0;

  const handleRead = (id: string) => {
    dispatch(markNotificationAsReadAPI(id));
  };

  const handleMarkAllRead = () => {
    if (userId) {
      dispatch(markAllNotificationsAsReadAPI(userId)); 
    }
  };

  const content = (
    <div style={{ width: 300 }}>
      {Array.isArray(notifications) && notifications.length > 0 ? (
        <>
          <List
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                style={{
                  background: item.read ? "#fff" : "#e6f7ff",
                  cursor: "pointer",
                }}
                onClick={() => handleRead(item.id)}
              >
                {item.message}
              </List.Item>
            )}
          />
          <Button type="link" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          No notifications
        </div>
      )}
    </div>
  );

  return (
    <Popover content={content} title="Notifications" trigger="click">
      <Badge count={unreadCount}>
        <Avatar
          size="large"
          icon={<BellOutlined style={{ color: "black" }} />}
          style={{ cursor: "pointer", backgroundColor: "white" }}
        />
      </Badge>
    </Popover>
  );
};

export default Bell;
