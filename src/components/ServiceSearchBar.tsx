import { Input } from "antd";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (filters: {
    categoryId?: string;
    name?: string;
  }) => void;
}

const ServiceSearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<{
    categoryId?: string;
    name?: string;
  }>({});

  const handleInputChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white shadow-md rounded-lg">
      <Input
        placeholder="Search by Category ID"
        onChange={(e) => handleInputChange("categoryId", e.target.value)}
        allowClear
        className="w-1/3"
      />
      <Input
        placeholder="Search by Name"
        onChange={(e) => handleInputChange("name", e.target.value)}
        allowClear
        className="w-1/3"
      />
    </div>
  );
};

export default ServiceSearchBar;
