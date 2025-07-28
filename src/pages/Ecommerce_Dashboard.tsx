
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { FaArrowDown, FaArrowUp, FaEllipsisV } from "react-icons/fa";
import wallet from "../assets/Profile/wallet.png";
import OrderTable from "../components/OrderTable";
import { BACKEND_URL } from "../config/server";
import revenue from "../assets/Profile/revenue.png";

type SalesCount = {
  Accepted: number;
  Rejected: number;
  Pending: number;
};

type DashboardData = {
  revenue: string;
  totalProducts: string;
  salesCount: SalesCount;
  recentSales: string;
  expenses: { title: string; value: string };
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storeData = useSelector((state: RootState) => state.Login);
  const storeId = storeData?._id || "";
  const token = storeData?.token || ""; // Assuming token is stored in Redux state

  useEffect(() => {
    const fetchData = async () => {
      if (!storeId || !token) {
        setError("Store ID or token not found");
        setLoading(false);
        return;
      }

      try {
        // Fetch revenue and sales data
        const revenueResponse = await axios.get(
          `${BACKEND_URL}/order/get_store_revenue_sales`,
          {
            params: {
              store_id: storeId,
            },
            headers: {
              Authorization: `Bearer ${token}`, // Include token in headers
            },
          }
        );

        const { totalRevenue, salesCount, totalCount } = revenueResponse.data;

        // Fetch product count
        const productCountResponse = await axios.get(
          `${BACKEND_URL}/product/get_store_product_count`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in headers
            },
          }
        );
        const totalProducts = productCountResponse.data.toString(); // Convert number to string

        setDashboardData({
          revenue: totalRevenue,
          totalProducts: totalProducts,
          salesCount: {
            Accepted: salesCount?.Accepted ?? 0,
            Rejected: salesCount?.Rejected ?? 0,
            Pending: salesCount?.Pending ?? 0,
          },
          recentSales: "482k",
          expenses: { title: "4,234", value: "2023" },
        });
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [storeId, token]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 space-y-6">
      <div className="flex flex-wrap xl:space-x-4 xl:flex-nowrap">
        <div className="xl:w-2/5 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sales Card */}
          <div className="bg-white shadow-md p-4 rounded-md relative w-full max-w-sm mx-auto">
            <div className="flex items-center space-x-3">
              <img src={wallet} alt="Sales" className="w-10 h-10" />
              <p className="text-gray-600 text-lg font-medium">Sales</p>
            </div>
            {/* Responsive Grid Layout: Column on Mobile, Row on Larger Screens */}
           <div className="flex justify-between flex-wrap gap-2 mt-4">

              {["Accepted", "Rejected", "Pending"].map((status, id) => (
                <div
                  key={id}
                  className="p-3 bg-gray-100 rounded-md text-center flex flex-col items-center"
                >
                  <p className="text-gray-500 text-xs sm:text-sm text-center break-words w-full">
                    {status}
                  </p>
                  <h3 className="text-lg font-semibold">
                    {dashboardData?.salesCount[status as keyof SalesCount] || 0}
                  </h3>
                </div>
              ))}
            </div>
          </div>
          {/* Total Products Card */}
          <div className="bg-white shadow-md p-4 rounded-md relative">
            <p className="text-gray-600 mt-2">Total Products</p>
            <h3 className="text-2xl font-medium">
              {dashboardData?.totalProducts}
            </h3>
          </div>
        </div>
      </div>
      {/* Revenue Section */}
      <div className="flex gap-2 max-sm:flex-col">
        <div className="w-1/2 max-sm:w-full bg-white shadow-md p-4 rounded-md">
          <div>
            <img src={revenue} alt="" />
          </div>
          <h3 className="text-lg text-gray-500">Revenue</h3>
          <p className="text-gray-600 text-xl font-bold">
            {dashboardData?.revenue}{" "}
            <span className="text-blue-500 text-sm">PKR</span>
          </p>
        </div>
      </div>
      {/* Orders Table */}
      <div className="flex max-xl:flex-col">
    <div className="p-6 bg-white min-h-screen" style={{ minWidth: '2560px' }}>
          <OrderTable />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;