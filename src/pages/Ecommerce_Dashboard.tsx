import { useEffect, useState } from "react";
import OrderTable from "../components/OrderTable";
import { getAllOrders, getStoreRevenueSales } from "../api/order/api";
import { useDispatch } from "react-redux";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    //@ts-ignore
    dispatch(getStoreRevenueSales({page_no: currentPage}));
  }, [currentPage]);
  
  useEffect(() => {
    //@ts-ignore
    dispatch(getAllOrders({ page_no: currentPage }));
  }, [currentPage]);

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 space-y-6">
      <div className="flex max-xl:flex-col w-full">
        <div className="w-full justify-between ">
          <OrderTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
