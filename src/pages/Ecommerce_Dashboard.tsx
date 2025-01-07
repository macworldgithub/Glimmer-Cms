import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import laptop from "../assets/Profile/laptop_pic.png";
type DashboardData = {
  user: {
    name: string;
    totalSales: string;
    salesTarget: string;
  };
  visitors: { title: string; percentage: string; change: string };
  activity: { title: string; percentage: string; change: string };
  cardsSection: { title: string; value: string; change: string }[];
  performance: { earnings: string; sales: string };
  conversionRate: {
    rate: string;
    impressions: string;
    addedToCart: string;
    checkout: string;
    purchased: string;
  };
  revenue: string;
  expenses: string;
  products: { name: string; category: string; payment: string; status: string }[];
  balance: { wallet: string; payout: string };
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Simulate fetching dynamic data from an API
    const fetchData = async () => {
      const data: DashboardData = {
        user: {
          name: "Katie",
          totalSales: "$48.9k",
          salesTarget: "78%",
        },
        visitors: {
          title: "New Visitors",
          percentage: "23%",
          change: "-13.24%",

        },
        activity: {
          title: "Activity",
          percentage: "82%",
          change: "24.8%%",
        },
        // cardsSection: [
        //   {
        //     title: "Sales",
        //     value: "$4,679",
        //     change: "+28.42%",
        //   },
        //   {
        //     title: "Profit",
        //     value: "624k",
        //     change:""
        //   },
        //   {
        //     title: "Expenses",
        //     value: "$21k",
        //     change: "",
        //   },
        //   {
        //     title: "Transactions",
        //     value: "$14,857",
        //     change: "+28.14%",
        //   },
        // ],
        
        performance: { earnings: "$9,846.17", sales: "$25.7M" },
        conversionRate: {
          rate: "8.72%",
          impressions: "12.4k",
          addedToCart: "-8.5%",
          checkout: "+9.12%",
          purchased: "+2.83%",
        },
        revenue: "$42,389",
        expenses: "4,234",
        products: [
          { name: "Product 1", category: "Category A", payment: "$120", status: "Completed" },
          { name: "Product 2", category: "Category B", payment: "$149", status: "Pending" },
          { name: "Product 3", category: "Category C", payment: "$89", status: "Cancelled" },
        ],
        balance: { wallet: "$9.25k", payout: "$4.2k" },
      };
      setDashboardData(data);
    };

    fetchData();
  }, []);

  if (!dashboardData) return <div>Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 space-y-6">
      {/* Section 1 */}
      <div className="flex flex-wrap xl:space-x-4 xl:flex-nowrap">
        {/* Left Section */}
        <div className="xl:w-2/5 w-full bg-white shadow-md p-4 rounded-md flex">
          <div className="w-[75%]">
            <h1 className="text-lg">Congratulations {dashboardData.user.name}! 🎉</h1>
            <p className="text-gray-600">Best seller of the month</p>
            <h3 className="text-lg font-medium mt-2 text-[#787BFF]">{dashboardData.user.totalSales}</h3>
            <p className="text-gray-600">{dashboardData.user.salesTarget} of target 🚀</p>
            <button className="bg-[#5F61E6] shadow-xl text-white px-4 py-2 rounded">View Sales</button>
          </div>
          <div className="w-[25%]">
            <img src={laptop} className="h-44" />
          </div>
        </div>

        {/* Right Section */}
        <div className="xl:w-3/5 w-full bg-white shadow-md p-6 rounded-md md:flex block  mt-4 xl:mt-0">
          {/* Visitors Section */}
          <div className="md:w-1/2 w-full flex flex-row justify-between">
            <div>
              <p className="text-gray-600 text-lg">{dashboardData.visitors.title}</p>
              <h3 className="text-2xl font-medium">{dashboardData.visitors.percentage}</h3>
              <div className="flex">
                <span className="text-[#FF3E1D] text-sm mr-1 mt-1"><FaArrowDown /></span>
                <p className="text-[#FF3E1D] text-sm">{dashboardData.visitors.change}</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-1">Last Week</p>
          </div>

          <div className="w-[1px] bg-gray-300 mx-6 hidden md:flex"></div>
          <div className="w-full h-[1px]  bg-gray-300 mx-auto md:hidden flex"></div>

          {/* Activity Section */}
          <div className="md:w-1/2 w-full flex flex-row justify-between">
            <div>
              <p className="text-gray-600 text-lg">{dashboardData.activity.title}</p>
              <h3 className="text-2xl font-medium">{dashboardData.activity.percentage}</h3>
              <div className="flex">
                <span className="text-[#71DD37] text-sm mr-1 mt-1"><FaArrowUp /></span>
                <p className="text-[#71DD37] text-sm">{dashboardData.activity.change}</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-1">Last Week</p>
          </div>
        </div>
      </div>


 {/* Section 2 */} 
<div className="flex flex-wrap xl:space-x-4 xl:flex-nowrap">
  {/* Left Section */}
  <div className="xl:w-2/5 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
    {[
      { title: "Sales", value: "$4,679", change: "+28.42%", icon: "wallet " },
      { title: "Profit", value: "624k", change: "", icon: "" },
      { title: "Expenses", value: "$21k", change: "", icon: "" },
      { title: "Transactions", value: "$14,857", change: "+28.14%", icon: "icon-transactions.png" },
    ].map((card, id) => (
      <div key={id} className="bg-white shadow-md p-4 rounded-md flex items-center space-x-4">
        <img src={card.icon} alt={card.title} className="w-10 h-10" />
        <div>
          <p className="text-gray-600">{card.title}</p>
          <h3 className="text-xl font-bold">{card.value}</h3>
          {card.change && (
            <p className={`text-sm ${card.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
              {card.change}
            </p>
          )}
        </div>
      </div>
    ))}
  </div>
  {/* Right Section */}
  <div className="xl:w-3/5 w-full flex flex-wrap bg-white shadow-md p-6 rounded-md space-y-6 xl:space-y-0">
    {[
      { title: "Income", value: "$42,845", change: "+2.34k" },
      { title: "Expense", value: "$38,658", change: "-1.15k" },
      { title: "Profit", value: "$18,220", change: "+1.35k" },
    ].map((report, idx) => (
      <div key={idx} className="w-full md:w-1/2">
        {idx === 0 && (
          <>
            <h3 className="font-bold text-lg">Total Income</h3>
            <p className="text-gray-600">Yearly report overview</p>
          </>
        )}
        {idx === 0 && <h3 className="font-bold text-lg mt-6">Report</h3>}
        {idx > 0 && <div className="flex justify-between mt-4">
          <span>{report.title}</span>
          <span className={`${report.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>{report.value}</span>
        </div>}
      </div>
    ))}
  </div>
</div>




      {/* Section 3 */}
      <div className="flex space-x-6">
        {/* Left Section */}
        <div className="w-1/3 bg-white shadow-md p-4 rounded-md">
          <h3 className="font-bold text-lg">Performance</h3>
          <p className="text-gray-600">Earnings: {dashboardData.performance.earnings}</p>
          <p className="text-gray-600">Sales: {dashboardData.performance.sales}</p>
        </div>
        {/* Center Section */}
        <div className="w-1/3 bg-white shadow-md p-4 rounded-md">
          <h3 className="font-bold text-lg">Conversion Rate</h3>
          <p className="text-gray-600">{dashboardData.conversionRate.rate}</p>
        </div>
        {/* Right Section */}
        <div className="w-1/3 grid grid-rows-3 gap-6">
          <div className="bg-white shadow-md p-4 rounded-md">
            <h3 className="font-bold text-lg">Revenue</h3>
            <p className="text-gray-600">{dashboardData.revenue}</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-md">
            <h3 className="font-bold text-lg">Sales</h3>
            <p className="text-gray-600">{dashboardData.user.salesTarget}</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-md">
            <h3 className="font-bold text-lg">Expenses</h3>
            <p className="text-gray-600">{dashboardData.expenses}</p>
          </div>
        </div>
      </div>

      {/* Section 4 */}
      <div className="flex space-x-6">
        {/* Left Section */}
        <div className="w-2/3 bg-white shadow-md p-4 rounded-md">
          <h3 className="font-bold text-lg">Product Table</h3>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border-b p-2">Product</th>
                <th className="border-b p-2">Category</th>
                <th className="border-b p-2">Payment</th>
                <th className="border-b p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.products.map((product, idx) => (
                <tr key={idx}>
                  <td className="border-b p-2">{product.name}</td>
                  <td className="border-b p-2">{product.category}</td>
                  <td className="border-b p-2">{product.payment}</td>
                  <td className="border-b p-2">{product.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Right Section */}
        <div className="w-1/3 bg-white shadow-md p-4 rounded-md">
          <h3 className="font-bold text-lg">Total Balance</h3>
          <p className="text-gray-600">Wallet: {dashboardData.balance.wallet}</p>
          <p className="text-gray-600">Payout: {dashboardData.balance.payout}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
