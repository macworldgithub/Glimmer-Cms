import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import wallet from "../assets/Profile/wallet.png";
import { BACKEND_URL } from "../config/server";
import revenue from "../assets/Profile/revenue.png";
import SalonOrderTable from "../components/SalonOrderTable";

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
  const [totalPages, setTotalPages] = useState(1);

  const storeData = useSelector((state: RootState) => state.Login);

  const storeId = storeData?._id || "";
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      if (!storeId) {
        setError("Store ID not found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/order/get_store_revenue_sales`, {
          params: {
            store_id: storeId,
            page_no: totalPages,
          },
        });

        const { totalRevenue, salesCount, totalCount } = response.data;

        setTotalPages(Math.ceil(totalCount / itemsPerPage));

        setDashboardData({
          revenue: totalRevenue,
          totalProducts: totalCount.toString(),
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
  }, [storeId, totalPages]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 space-y-6">
      <div className="flex flex-wrap xl:space-x-4 xl:flex-nowrap">
        <div className="xl:w-2/5 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sales Card */}
          <div className="bg-white shadow-md p-4 rounded-md relative">
            <img src={wallet} alt="Sales" className="w-10 h-10" />
            <p className="text-gray-600 mt-2">Bookings Summary</p>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {["Pending", "Approved", "Completed"].map((status, id) => (
                <div key={id} className="p-3 bg-gray-100 rounded-md text-center">
                  <p className="text-gray-500 text-sm">{status}</p>
                  <h3 className="text-lg font-medium">
                    {dashboardData?.salesCount[status as keyof SalesCount]}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Total Bookings Card */}
          <div className="bg-white shadow-md p-4 rounded-md relative">
            <p className="text-gray-600 mt-2">Total Bookings</p>
            <h3 className="text-2xl font-medium">{dashboardData?.totalProducts}</h3>
          </div>
        </div>
      </div>

      {/* Earning Section */}
      <div className="flex gap-2 max-sm:flex-col">
        <div className="w-1/2 max-sm:w-full bg-white shadow-md p-4 rounded-md">
          <div>
            <img src={revenue} alt="" />
          </div>
          <h3 className="text-lg text-gray-500">Total</h3>
          <p className="text-gray-600 text-xl font-bold">{dashboardData?.revenue} <span className="text-blue-500 text-sm">PKR</span></p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="flex max-xl:flex-col">
        <div className="w-full max-xl:w-full">
          <SalonOrderTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
