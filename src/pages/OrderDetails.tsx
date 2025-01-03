import { Avatar } from "antd";
import { useEffect, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { MdOutlineShoppingCart } from "react-icons/md";
import pic from "../assets/Profile/pic1.png";

import AddNewAddress from "./AddAdress";
import EditUserInfoModal from "./EditUserInfo";
interface Order {
  id: string;
  status: string[];
  date: string;
  details: OrderDetail[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  customer: CustomerDetails;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  shippingActivity: Activity[];
}

interface OrderDetail {
  product: string;
  price: number;
  qty: number;
  total: number;
}

interface CustomerDetails {
  name: string;
  customerId: string;
  ordersCount: number;
  email: string;
  phone: string;
}

interface Activity {
  title: string;
  time: string;
  description: string;
}

const OrderDetails = () => {

  const [order, setOrder] = useState<Order | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {

    const fetchedOrder: Order = {
      id: "32543",
      status: ["Paid", "Ready to Pickup"],
      date: "Aug 17, 5:48 (ET)",
      details: [
        { product: "Product A", price: 10, qty: 2, total: 20 },
        { product: "Product B", price: 15, qty: 1, total: 15 },
        { product: "Product C", price: 10, qty: 2, total: 20 },
        { product: "Product D", price: 15, qty: 1, total: 15 },
      ],
      subtotal: 2093,
      discount: 2,
      tax: 28,
      total: 2113,
      customer: {
        name: "Shamus Tuttle",
        customerId: "#58909",
        ordersCount: 12,
        email: "Shamus889@yahoo.com",
        phone: "+1 (609) 972-22-22",
      },
      shippingAddress: "45 Roker Terrace, Latheronwheel, KWS 8NW, London, UK",
      billingAddress: "45 Roker Terrace, Latheronwheel, KWS 8NW, London, UK",
      paymentMethod: "****4291",
      shippingActivity: [
        {
          title: "Order was placed",
          time: "Tuesday 11:29 AM",
          description: "Your order has been placed successfully.",
        },
        {
          title: "Pick-up",
          time: "Wednesday 11:29 AM",
          description: "Pick-up scheduled with courier.",
        },
        {
          title: "Dispatched",
          time: "Thursday 11:29 AM",
          description: "Item has been picked up by courier.",
        },
        {
          title: "Package arrived",
          time: "Saturday 15:20 AM",
          description: "Package arrived at an Amazon facility, NY",
        },
        {
          title: "Dispatched for delivery",
          time: "Today 14:12 PM",
          description: "Package has left an Amazon facility, NY",
        },
        {
          title: "Delivery",
          time: "",
          description: "Package will be delivered by tomorrow",
        },
      ],
    };

    setOrder(fetchedOrder);
  }, []);

  if (!order) {
    return <div className="text-center text-gray-500">Loading order details...</div>;
  }



  return (
    <div className="mx-auto overflow-hidden ">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between max-md:items-start ">
        <div>
          <div className="flex items-center gap-2 mt-2">
            <div>
              <h1 className="md:text-xl md:font-medium text-gray-600 text-sm font-bold ">Order #{order.id}</h1>
            </div>
            <div className="flex justify-center items-center text-[10px] sm:text-md">
              {order.status.map((status, index) => (
                <span
                  key={index}
                  className={`px-3 py-1  rounded-md font-medium mx-1  ${status === "Paid" ? "bg-[#E8FADF] text-[#7ADF44]" : "bg-[#D7F5FC] text-[#0AC5ED] "
                    }`}
                >
                  {status}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500">{order.date}</p>

        </div>
        <button className="text-gray-600 hover:underline py-4">Delete Order</button>
      </div>


      <div className="flex gap-4 flex-col lg:flex-row ">

        <div className=" space-y-6 w-2/3 max-lg:w-full">
          {/* Order Details */}
          <div className="bg-white p-4 rounded-lg shadow">

            <div className="flex items-center justify-between">
              <h2 className=" md:text-lg text-md font-medium text-gray-500 ">Order details</h2>
              <button className="text-blue-500 hover:underline">Edit</button>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">PRODUCTS</th>
                    <th className="py-2">PRICE</th>
                    <th className="py-2">QTY</th>
                    <th className="py-2">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {order.details.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{item.product}</td>
                      <td className="py-2">${item.price}</td>
                      <td className="py-2">{item.qty}</td>
                      <td className="py-2">${item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-800">
              <p>
                Subtotal: <span className="font-semibold">${order.subtotal}</span>
              </p>
              <p>
                Discount: <span className="font-semibold">${order.discount}</span>
              </p>
              <p>
                Tax: <span className="font-semibold">${order.tax}</span>
              </p>
              <p>
                Total: <span className="font-semibold text-lg">${order.total}</span>
              </p>
            </div>
          </div>

          {/* Shipping Activity */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="sm:text-lg text:md font-medium text-gray-500">Shipping activity</h2>
            <ul className="mt-4 space-y-4  sm:text-sm text-xsm text-gray-700">
              {order.shippingActivity.map((activity, index) => (
                <li key={index}>
                  <div className="flex gap-2 ">
                    <div className="py-1"><GoDotFill size={10} /></div>


                    <p className="font-semibold text-gray-600">{activity.title}</p>
                  </div>
                  <p className="text-gray-500 pl-4">{activity.time}</p>

                  <p className="pl-4 text-gray-500">{activity.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className=" space-y-6 w-1/3 max-lg:w-full">
          {/* Customer Details */}
          <div className="bg-white p-4 rounded-lg shadow ">
            <h2 className="sm:text-lg text:md  font-medium text-gray-500">Customer details</h2>
            <div className="flex gap-x-4">
              <div>
                <Avatar size={"large"} src={pic} icon="user" />
              </div>
              <div className="sm:text-sm text-xsm text-gray-500">
                <div className="font-semibold ">{order.customer.name}</div>
                <div>Customer ID: {order.customer.customerId}</div>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="bg-[#E8FADF] text-[#7ADF44] rounded-full p-2 ">
                <MdOutlineShoppingCart size={20} />
              </div>
              <div className="sm:text-sm text-xsm text-gray-500 pt-2">
                <div className="font-semibold ">{order.customer.ordersCount} Orders</div>
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <div className="sm:text-sm text-[12px] text-gray-500">
                <div className=" font-semibold ">Contact info</div>
                <div>Email: {order.customer.email}</div>
                <div>Mobile: {order.customer.phone}</div>
              </div>
              <div>
                <button className="text-[#9698FF] sm:font-semibold font-medium " onClick={() => setIsUserModalOpen(true)}>Edit</button>
                <EditUserInfoModal
                  isOpen={isUserModalOpen}
                  onClose={() => setIsUserModalOpen(false)}
                />

              </div>

            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-4 rounded-lg shadow flex justify-between">
            <div>
              <h2 className="sm:text-lg text:md font-medium text-gray-500">Shipping address</h2>
              <p className="mt-2 sm:text-sm text-[12px] text-gray-500 w-1/2">{order.shippingAddress}</p>
            </div>
            <div>
              <button className="text-[#9698FF] sm:font-semibold font-medium" onClick={() => setIsAddModalOpen(true)}>Edit</button>

              <AddNewAddress
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
              />
            </div></div>

          {/* Billing Address */}
          <div className="bg-white p-4 rounded-lg shadow flex justify-between">
            <div>
              <h2 className="sm:text-lg text:md font-medium text-gray-500">Billing address</h2>
              <p className="mt-2 sm:text-sm text-[12px] text-gray-500 w-1/2">{order.billingAddress}</p>
              <p className="sm:text-lg text-sm font-medium text-gray-500">Master Card</p>
              <p className="mt-2 sm:text-sm text-[12px] font-medium text-gray-500">Card Number:{order.paymentMethod}</p>
            </div>
            <div>
              <button className="text-[#9698FF] sm:font-semibold font-medium" onClick={() => setIsAddModalOpen(true)}>Edit</button>
              <AddNewAddress
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;


