import { useEffect, useState } from "react";
import { BsCurrencyDollar } from "react-icons/bs";
import { FaArrowDown, FaArrowUp, FaEllipsisV, FaWallet } from "react-icons/fa";
import { IoIosArrowUp } from "react-icons/io";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import income from "../assets/Profile/income.png";
import laptop from "../assets/Profile/laptop_pic.png";
import profit from "../assets/Profile/profit.png";
import revenue from "../assets/Profile/revenue.png";
import transaction from "../assets/Profile/transaction.png";
import wallet from "../assets/Profile/wallet.png";
import OrderTable from "../components/OrderTable";

import { getAllOrders, getDashBoardOrders } from "../api/order/api";

import { useDispatch, UseDispatch } from "react-redux";

type DashboardData = {
  user: {
    name: string;
    totalSales: string;
    salesTarget: string;
  };
  visitors: { title: string; percentage: string; change: string };
  activity: { title: string; percentage: string; change: string };
  cardsSection: {
    image: string;
    title: string;
    value: string;
    change: string;
  }[];
  reportSection: {
    image: string;
    title: string;
    value: string;
    change: string;
  }[];
  performance: { earnings: string; sales: string };
  conversionRate: {
    rate: string;
    impressions: string;
    addedToCart: string;
    checkout: string;
    purchased: string;
  };
  revenue: string;
  recentSales: string;
  expenses: { title: string; value: string };
  products: {
    name: string;
    category: string;
    payment: string;
    status: string;
  }[];
  balance: { wallet: string; payout: string };
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    //@ts-ignore
    dispatch(getAllOrders({ page_no: currentPage }));
  }, [currentPage]);

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

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
          change: "24.8%",
        },
        cardsSection: [
          {
            image: wallet,
            title: "Sales",
            value: "$4,679",
            change: "+28.42%",
          },
          {
            image: "",
            title: "Total Proucts",
            value: "8",
            change: "",
          },
        ],
        reportSection: [
          {
            image: income,
            title: "Income",
            value: "$42,845",
            change: "+2.34k",
          },
          {
            image: wallet,
            title: "Expense",
            value: "$38,658",
            change: "-1.15k",
          },
          {
            image: profit,
            title: "Profit",
            value: "$18,220",
            change: "+1.35k",
          },
        ],
        performance: {
          earnings: "$9,846.17",
          sales: "$25.7M",
        },
        conversionRate: {
          rate: "8.72%",
          impressions: "12.8%",
          addedToCart: "-8.5%",
          checkout: "9.12%",
          purchased: "2.83%",
        },

        revenue: "$42,389",
        recentSales: "482k",
        expenses: {
          title: "4,234",
          value: "2023",
        },
        products: [
          {
            name: "Product 1",
            category: "Category A",
            payment: "$120",
            status: "Completed",
          },
          {
            name: "Product 2",
            category: "Category B",
            payment: "$149",
            status: "Pending",
          },
          {
            name: "Product 3",
            category: "Category C",
            payment: "$89",
            status: "Cancelled",
          },
        ],
        balance: { wallet: "$9.25k", payout: "$4.2k" },
      };
      setDashboardData(data);
    };

    fetchData();
  }, []);
  const [activeCard, setActiveCard] = useState(null);

  const handleIconClick = (id) => {
    if (activeCard === id) {
      setActiveCard(null); // Close the card if it's already active
    } else {
      setActiveCard(id);
    }
  };

  const handleViewMore = (id) => {
    console.log(`View More clicked for card ${id}`);
    // Add functionality for "View More"
  };

  const handleDelete = (id) => {
    console.log(`Delete clicked for card ${id}`);
    // Add functionality for "Delete"
  };

  const [showDropdownIncome, setShowDropdownIncome] = useState(false);
  const [showDropdownReport, setShowDropdownReport] = useState(false);
  const [showDropdownPerformance, setShowDropdownPerformance] = useState(false);
  const [showConversionRate, setShowConversionRate] = useState(false);
  const [showTotalBalance, setShowTotalBalance] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);

  if (!dashboardData) return <div>Loading...</div>;

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 space-y-6">
      {/* Section 1 */}

      {/* Section 2 */}
      <div className="flex flex-wrap xl:space-x-4 xl:flex-nowrap ">
        {/* Left Section: 4 Cards */}
        <div className="xl:w-2/5 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboardData?.cardsSection.map((card, id) => (
            <div
              key={id}
              className="bg-white shadow-md p-4 rounded-md relative"
            >
              {card.image && (
                <img src={card.image} alt={card.title} className="w-10 h-10" />
              )}
              <div>
                <p className="text-gray-600 mt-2">{card.title}</p>
                <h3 className="text-2xl font-medium">{card.value}</h3>
                {card.change && (
                  <div className="flex">
                    <span className="text-[#71DD37] text-sm mr-1 mt-1">
                      <FaArrowUp />
                    </span>
                    <p className="text-[#71DD37] text-sm">{card.change}</p>
                  </div>
                )}
              </div>
              <button
                className="absolute top-2 right-2 text-gray-400"
                onClick={() => handleIconClick(id)}
              >
                <FaEllipsisV />
              </button>
              {activeCard === id && (
                <div className="absolute top-10 right-2 bg-white shadow-md rounded-md w-32 p-2">
                  <button
                    className="text-gray-600 w-full text-left hover:bg-gray-100 p-2"
                    onClick={() => handleViewMore(id)}
                  >
                    View More
                  </button>
                  <button
                    className="text-gray-600 w-full text-left hover:bg-gray-100 p-2"
                    onClick={() => handleDelete(id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Section: Report Card */}
      </div>

      {/* Section 3 */}

      <div className="xl:w-1/2 md:block hidden w-full xl:hidden  max-md:mt-2 ">
        <div className="flex  gap-2 max-sm:flex-col">
          <div className="w-1/2 max-sm:w-full  bg-white shadow-md p-4 rounded-md">
            <div>
              <img src={revenue} alt="" />
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-lg text-gray-500 pt-2 ">Revenue</h3>
              <div className="relative">
                <FaEllipsisV
                  className="text-gray-500 cursor-pointer"
                  onClick={() => setShowRevenue(!showRevenue)}
                />
                {showRevenue && (
                  <div className="absolute right-0 top-6 bg-white shadow-md rounded-md p-2 z-10 w-40">
                    <p className="text-sm text-gray-700 cursor-pointer w-full text-left hover:bg-gray-100 p-2">
                      View More
                    </p>
                    <p className="text-sm text-gray-700 cursor-pointer w-full text-left hover:bg-gray-100 p-2">
                      Delete
                    </p>
                  </div>
                )}
              </div>
            </div>

            <p className="text-gray-600 text-xl font-bold ">
              {dashboardData.revenue}
            </p>
            <span className="text-[#71DD37] flex gap-1 text-sm">
              <FaArrowUp size={16} />
              +52.18%
            </span>
          </div>
          <div className="w-1/2 max-sm:w-full bg-white shadow-md p-4 rounded-md">
            <h3 className="text-lg text-gray-500 ">Recent Sales</h3>
            <p className="text-gray-600 text-xl font-bold ">
              {dashboardData.recentSales}
            </p>
          </div>
        </div>
        <div className="bg-white shadow-md p-4 rounded-md mt-4">
          <h3 className="text-lg text-gray-500 ">Expenses</h3>
          <p className="text-gray-600 text-xl font-bold ">
            {dashboardData.expenses.title}
          </p>
          <span className="text-[#FF3E1D] flex text-sm mb-4">
            <FaArrowDown size={16} />
            8.2%
          </span>
          <span className="text-gray-500 font-medium bg-gray-200 p-2 ">
            {dashboardData.expenses.value} YEAR
          </span>
        </div>
      </div>

      <div className="flex max-xl:flex-col w-full">
        <div className="w-full justify-between ">
          <OrderTable
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
