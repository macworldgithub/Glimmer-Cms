import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { Badge, Popover, List, Button, Avatar } from "antd";
import { BellOutlined } from "@ant-design/icons";
import {
  markNotificationAsReadAPI,
  markAllNotificationsAsReadAPI,
} from "../api/auth/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Bell = () => {
  const notifications = useSelector(
    (state: RootState) => state.Notifications.notifications
  );
  const role = useSelector((state: RootState) => state.Login.role);
  const userId = useSelector((state: RootState) => state.Login._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [bellOpen, setBellOpen] = useState(false);

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

  const handleView = (customerName: string, orderId?: string, item?: any) => {
    setBellOpen(false);
    if (role === "salon") {
      navigate(`/booking?customerName=${encodeURIComponent(customerName)}`);
    }
    else if (role === "store") {
      navigate(`/order-details/${orderId}`);
    } 
    else if (role === "super_admin") {
      if (item?.data?.productList) {
        const storeId = item.data.productList[0]?.storeId;
        const orderId = item.data._id;
        navigate(`/order-details/${orderId}?store=${storeId}`);
      } else {
        const salonId = item.data.salonId;
        navigate(`/SuperAdmin_Booking_List?salonId=${salonId}&customerName=${customerName}`);
      }
    }
  };

  const content = (
    <div
      style={{
        width: 520,
        maxHeight: 400,
        overflowY: "auto",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: "12px",
      }}
    >
      {Array.isArray(notifications) && notifications.length > 0 ? (
        <>
          <List
            dataSource={notifications}
            renderItem={(item) => {
              console.log(item);
              return (
                <List.Item
                  key={item.id}
                  style={{
                    background: item.read ? "#fafafa" : "#e6f4ff",
                    padding: "10px 12px",
                    borderRadius: 6,
                    marginBottom: 8,
                    transition: "background 0.3s",
                  }}
                  onClick={() => handleRead(item.id)}
                >
                  <div
                    style={{ flex: 1, cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRead(item.id);
                    }}
                  >
                    {item.message}
                  </div>

                  <Button
                    size="small"
                    type="link"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleView(item.data.customerName, item.data._id, item);
                      handleRead(item.id); 
                    }}
                  >
                    View
                  </Button>
                </List.Item>
              )
            }}
          />
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <Button
              type="primary"
              size="middle"
              onClick={handleMarkAllRead}
              style={{ borderRadius: 20 }}
            >
              Mark all as read
            </Button>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "20px 0", color: "#888" }}>
          No notifications
        </div>
      )}
    </div>
  );

  return (
    <Popover content={content} title={null} trigger="click" placement="bottomRight" open={bellOpen}
      onOpenChange={(visible) => setBellOpen(visible)}>
      <Badge
        count={unreadCount}
        overflowCount={99}
        style={{ backgroundColor: "#5f61e6", boxShadow: "0 0 0 2px #fff" }}
      >
        <Avatar
          size="large"
          icon={<BellOutlined style={{ color: "#5f61e6", fontSize: 18 }} />}
          style={{
            cursor: "pointer",
            backgroundColor: "#fff",
            border: "1px solid #e0e0e0",
          }}
        />
      </Badge>
    </Popover>
  );
};

export default Bell;
