import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import wallet from "../assets/Profile/wallet.png";
import { BACKEND_URL } from "../config/server";
import revenue from "../assets/Profile/revenue.png";
import SalonOrderTable from "../components/SalonOrderTable";

type SalesCount = {
  accumulatedApprovedStatus: number;
  accumulatedRejectedStatus: number;
  accumulatedPendingStatus: number;
  accumulatedCompletedStatus: number;
  accumulatedCompleteAndPaidStatus: number;
};

type DashboardData = {
  total: string;
  totalFinalPrice: string;
  salesCount: SalesCount;
};

const Dashboard = () => {
  const token = useSelector((state: RootState) => state.Login.token);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let currentPage = 1;
        let totalPages = 1; // Will be updated dynamically
        let accumulatedSalesCount = {
          accumulatedApprovedStatus: 0,
          accumulatedRejectedStatus: 0,
          accumulatedPendingStatus: 0,
          accumulatedCompletedStatus: 0,
          accumulatedCompleteAndPaidStatus: 0,
        };
  
        let firstResponseData = null; // Store first page data separately
  
        while (currentPage <= totalPages) {
          const response = await axios.get(
            `${BACKEND_URL}/salon-service-bookings/getAllSalonBookingStatus`,
            {
              params: { page_no: currentPage },
              headers: { Authorization: `Bearer ${token}` },
            }
          );
  
          const {
            total,
            totalFinalPrice,
            accumulatedApprovedStatus,
            accumulatedRejectedStatus,
            accumulatedPendingStatus,
            accumulatedCompletedStatus,
            accumulatedCompleteAndPaidStatus,
            totalPages: fetchedTotalPages,
          } = response.data;
  
          if (currentPage === 1) {
            firstResponseData = { total, totalFinalPrice };
            totalPages = fetchedTotalPages || 1; 
          }
  
          accumulatedSalesCount.accumulatedApprovedStatus += accumulatedApprovedStatus || 0;
          accumulatedSalesCount.accumulatedRejectedStatus += accumulatedRejectedStatus || 0;
          accumulatedSalesCount.accumulatedPendingStatus += accumulatedPendingStatus || 0;
          accumulatedSalesCount.accumulatedCompletedStatus += accumulatedCompletedStatus || 0;
          accumulatedSalesCount.accumulatedCompleteAndPaidStatus += accumulatedCompleteAndPaidStatus || 0;
  
          currentPage++; 
        }
  
        setDashboardData({
          total: firstResponseData?.total || 0,
          totalFinalPrice: firstResponseData?.totalFinalPrice || 0,
          salesCount: accumulatedSalesCount,
        });
  
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [token]);

  const statusMapping: Record<string, keyof SalesCount> = {
    Approved: "accumulatedApprovedStatus",
    Rejected: "accumulatedRejectedStatus",
    Pending: "accumulatedPendingStatus",
    Completed: "accumulatedCompletedStatus",
    Paid: "accumulatedCompleteAndPaidStatus",
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 space-y-6">
      <div className="flex flex-wrap xl:space-x-4 xl:flex-nowrap">
        <div className="xl:w-[790px] w-full grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Bookings Summary Card */}
          <div className="bg-white shadow-md p-4 rounded-md relative w-full max-w-sm mx-auto">
            <div className="flex items-center space-x-3">
              <img src={wallet} alt="Bookings" className="w-10 h-10" />
              <p className="text-gray-600 text-lg font-medium">
                Bookings Summary
              </p>
            </div>

            {/* Responsive Grid Layout: Column on Mobile, Row on Larger Screens */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
              {["Approved", "Rejected", "Pending", "Completed", "Paid"].map((status, id) => (
                <div
                  key={id}
                  className="p-3 bg-gray-100 rounded-md text-center flex flex-col items-center"
                >
                  <p className="text-gray-500 text-xs sm:text-sm truncate w-[99vw]">
                    {status}
                  </p>
                  <h3 className="text-lg font-semibold">
                    {dashboardData?.salesCount[statusMapping[status]] || 0}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Total Bookings Card */}
          <div className="bg-white shadow-md p-4 rounded-md relative">
            <p className="text-gray-600 mt-2">Total Bookings</p>
            <h3 className="text-2xl font-medium">
              {dashboardData?.total}
            </h3>
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
          <p className="text-gray-600 text-xl font-bold">
            {dashboardData?.totalFinalPrice}{" "}
            <span className="text-blue-500 text-sm">PKR</span>
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="flex max-xl:flex-col">
        <div className="w-full max-xl:w-full">
      {/* <div className="p-6 bg-white min-h-screen" style={{ minWidth: '2560px' }}> */}
          <SalonOrderTable />
        </div>
      </div>
    </div>);
};

export default Dashboard;
