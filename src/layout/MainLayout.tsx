import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Bell from "../components/Bell";
import Profile from "../components/Profile";
import SideBar from "../components/SideBar";
import UpdateStoreModal from "../components/UpdateStore";
import SalonProfile from "../components/SalonProfile";
import UpdateSalonModal from "../components/UpdateSalon";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { addNotification } from "../slices/notificationSlice";
import { BACKEND_URL } from "../config/server";

// Sound effect (can be customized)
const notificationSound = new Audio("/notification.mp3");

const { Header, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<boolean>(false);
  const role = useSelector((state: RootState) => state.Login.role);
  console.log(role);
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket:", socket.id);
    });

    if (role === "store" || role === "super_admin") {
      socket.on("newOrder", (order) => {
        notificationSound.play();
        toast.success(`New order from ${order.customerName}`);
        dispatch(addNotification({
          id: order._id,
          message: `A new order has been placed by ${order.customerName}. Please review and process it. Order ID: ${order._id}`,
          timestamp: new Date().toISOString(),
          read: false,
          data: order,
        }));
      });
    }

    if (role === "salon" || role === "super_admin") {
      socket.on("newBooking", (booking) => {
        notificationSound.play();
        toast.success(`New booking from ${booking.customerName}`);
        dispatch(addNotification({
          id: booking._id,
          message: `A new salon appointment has been booked by ${booking.customerName}. Please review the details. Salon ID: ${booking._id}`,
          timestamp: new Date().toISOString(),
          read: false,
          data: booking,
        }));
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <Layout>
      <SideBar collapsed={collapsed} />
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "white",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined style={{ color: "#5f61e6" }} />
              ) : (
                <MenuFoldOutlined style={{ color: "#5f61e6" }} />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div className="flex items-center gap-2 pr-2">
            <Bell />
            {(role === "store" || role === "super_admin") && (
              <Profile profile={profile} setProfile={setProfile} />
            )}
            {role === "salon" && (
              <SalonProfile profile={profile} setProfile={setProfile} />
            )}
          </div>
        </Header>
        <Content
          style={{
            margin: "10px 16px",
            minHeight: 280,
            background: "#F5F5F5",
            overflowY: "auto",
            height: "60vh",
          }}
        >
          {(role === "store" || role === "super_admin") && (
            <UpdateStoreModal profile={profile} setProfile={setProfile} />
          )}
          {role === "salon" && (
            <UpdateSalonModal profile={profile} setProfile={setProfile} />
          )}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
