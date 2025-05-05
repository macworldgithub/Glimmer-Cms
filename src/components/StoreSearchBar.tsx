import { Input } from "antd";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (filters: {
    store_name?: string;
  }) => void;
}

const StoreSearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<{ store_name?: string }>({});

  const handleInputChange = (value: string) => {
    const newFilters = { store_name: value || undefined };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white shadow-md rounded-lg">
      <Input
        placeholder="Search by Store Name"
        onChange={(e) => handleInputChange(e.target.value)}
        allowClear
        className="w-1/3"
      />
    </div>
  );
};

export default StoreSearchBar;
