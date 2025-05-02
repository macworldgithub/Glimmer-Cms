import { DatePicker, Input, message, Select } from "antd";
import { useEffect, useState } from "react";
import { getAllServices } from "../api/service/api";

interface SearchBarProps {
  onSearch: (filters: {
    name?: string;
    category?: string;
    created_at?: string;
    categoryId?: string;
    subCategoryName?: string;
    subSubCategoryName?: string;
    customerName?: string;
    serviceName?: string;
  }) => void;
  categories?: { name: string; id: string }[];
  showCategories?: boolean;
  showServices?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  categories,
  showCategories = true,
  showServices = true,
}) => {
  const [filters, setFilters] = useState<{
    name?: string;
    category?: string;
    created_at?: string;
    customerName?: string;
    categoryId?: string;
    serviceName?: string;
  }>({});


  const handleInputChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white shadow-md rounded-lg">
      {showCategories && (
        <Input
          placeholder="Search by Name"
          onChange={(e) => handleInputChange("name", e.target.value)}
          allowClear
          className="w-1/3"
        />
      )}

      {showCategories && (
        <Select
          placeholder="Filter by Category"
          onChange={(value) => handleInputChange("category", value)}
          allowClear
          className="w-1/3"
        >
          {categories?.map((cat) => (
            <Select.Option key={cat.id} value={cat.id}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>
      )}

      {showServices && (
        <>
          <Input
            placeholder="Search by Customer Name"
            onChange={(e) => handleInputChange("customerName", e.target.value)}
            allowClear
            className="w-1/3" />
          <Input
            placeholder="Search by Service Name"
            onChange={(e) => handleInputChange("serviceName", e.target.value)}
            allowClear
            className="w-1/3" />
        </>
      )}
    </div>
  );
};

export default SearchBar;
