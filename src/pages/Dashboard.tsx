import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { FiTrendingUp } from "react-icons/fi";
import laptop from "../assets/Profile/laptop_pic.png";
const Dashboard = () => {
  const options = {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false, // Hide toolbar (zoom, pan, reset)
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      labels: {
        show: false, // Hide x-axis labels (numbers)
      },
      axisBorder: {
        show: false, // Hide x-axis line
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
    },
    yaxis: {
      labels: {
        show: false, // Hide y-axis labels (numbers)
      },
      axisBorder: {
        show: false, // Hide y-axis line
      },
      axisTicks: {
        show: false, // Hide y-axis ticks
      },
    },
    grid: {
      show: false, // Hide background grid lines
    },
    colors: ["#71DD37"], // Green color
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ["#28A745"], // Green gradient
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 100],
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    tooltip: {
      x: {
        formatter: function (value) {
          return value;
        },
      },
    },
  };

  const series = [
    {
      name: "Orders",
      data: [175, 275, 140, 205, 190, 295],
    },
  ];

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchedData = {
      user: {
        name: "John",
        badgeMsg: "You have done 72% more sales today.",
      },
      stats: {
        orders: "276k",
        sales: 4679,
        revenue: 425000,
        payments: 2456,
        profileReport: 84686,
      },
      revenueGrowth: 78,
      orderStatistics: {
        totalOrders: 8258,
        breakdown: [
          { name: "Saloon", count: 8250 },
          { name: "Products", count: 2380 },
          { name: "Gym", count: 849 },
          { name: "Others", count: 99 },
        ],
      },
      transactions: [
        { method: "Paypal", amount: 82.6 },
        { method: "Wallet", amount: 270.69 },
        { method: "Transfer Refund", amount: 637.91 },
      ],
    };
    //@ts-ignore
    setData(fetchedData);
  }, []);

  if (!data) {
    return (
      <div className="text-center text-gray-500">Loading dashboard...</div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* First Section */}
      <div className="flex gap-6 mb-6">
        <div className=" w-[70%] bg-white p-4 rounded-lg shadow mt-4 flex relative">
          <div className="w-[75%]">
            <h3 className="text-lg font-bold text-[#787BFF] pl-2">
              Congratulations {data.user.name}! 🎉
            </h3>
            <p className="text-gray-500 pl-2">
              You have done 72% more sales today.
            </p>
            <p className="text-gray-500 pl-2">
              Check your new badge in your profile.
            </p>
            <button className="  text-gray-500 hover:border border-gray-300 px-4 py-2 rounded max-sm:text-[10px] mt-4">
              View Badges
            </button>
          </div>
          <div className="w-[25%] max-sm:w-full max-sm:mt-2 absolute bottom-0 right-6">
            <img src={laptop} className="h-44 max-sm:h-20 " />
          </div>
        </div>
        <div className="w-[30%] flex gap-4">
          <div className="bg-white rounded-lg shadow w-1/2 ">
            <div>
              <h3 className="text-gray-500 pl-4 pt-4">Order</h3>
              <p className="text-xl font-bold text-gray-700 pl-4">
                {data.stats.orders}
              </p>
            </div>
            <div className="">
              <ApexCharts
                //@ts-ignore
                options={options}
                series={series}
                type="area"
                height={100}
                width="100%"
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow w-1/2">
            <h3 className="text-gray-500">Sales</h3>
            <p className="text-xl font-bold text-gray-700">
              ${data.stats.sales}
            </p>
            <span className="text-[#71DD37] flex items-center text-sm">
              <FiTrendingUp className="mr-1" /> +28.42%
            </span>
          </div>
        </div>
      </div>

      {/* Second Section */}
      {/* <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-700">Order Statistics</h3>
          <p className="text-gray-500">42.82k Total Sales</p>
          <div className="mt-4">
            {data.orderStatistics.breakdown.map((item, index) => (
              <div key={index} className="flex justify-between text-gray-700 py-2">
                <span>{item.name}</span>
                <span>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Revenue</h3>
            <p className="text-xl font-bold text-gray-700">${data.stats.revenue}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Payments</h3>
            <p className="text-xl font-bold text-gray-700">${data.stats.payments}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Profile Report</h3>
            <p className="text-xl font-bold text-gray-700">{data.stats.profileReport}</p>
          </div>
        </div>
      </div> */}

      {/* Third Section */}
      {/* <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold text-gray-700">Transactions</h3>
            <ul className="mt-4 space-y-3">
              {data.transactions.map((transaction, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                >
                  <span className="text-gray-600 font-medium">{transaction.method}</span>
                  <span
                    className={`font-semibold ${
                      transaction.amount > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    ${transaction.amount}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Weekly Growth</h3>
            <p className="text-xl font-bold text-gray-700">{data.revenueGrowth}%</p>
          </div>
        </div>
        <div className="col-span-1 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold text-gray-700">Revenue Insights</h3>
          <p className="text-gray-500">Manage your revenue efficiently.</p>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
