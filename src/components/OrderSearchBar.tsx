import { Input } from "antd";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (filters: {
    order_id?: string;
    customerEmail?: string;
  }) => void;
}

const OrderSearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<{
    order_id?: string;
    customerEmail?: string;
  }>({});

  const handleInputChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white shadow-md rounded-lg">
      <Input
        placeholder="Search by Order ID"
        onChange={(e) => handleInputChange("order_id", e.target.value)}
        allowClear
        className="w-1/3"
      />
      <Input
        placeholder="Search by Email"
        onChange={(e) => handleInputChange("customerEmail", e.target.value)}
        allowClear
        className="w-1/3"
      />
    </div>
  );
};

export default OrderSearchBar;
