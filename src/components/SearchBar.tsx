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
  }>({});

  const [services, setServices] = useState<{ _id: string; category: string }[]>(
    []
  );

  // Fetch Categories
  const fetchServices = async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      message.error("Failed to fetch services");
    }
  };
  useEffect(() => {
    fetchServices();
  }, []);

  const handleInputChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleDateChange = (date: any, dateString: string) => {
    const newFilters = { ...filters, created_at: dateString || undefined };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white shadow-md rounded-lg">
      <Input
        placeholder="Search by Name"
        onChange={(e) => handleInputChange("name", e.target.value)}
        allowClear
        className="w-1/3"
      />

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
        <Select placeholder="Filter by Service" className="w-1/3">
          {services.map((service) => (
            <Select.Option
              key={service._id}
              value={service._id}
              data-name={service._id}
            >
              {service._id}
            </Select.Option>
          ))}
        </Select>
      )}

      <DatePicker
        placeholder="Filter by Created Date"
        onChange={handleDateChange}
        format="YYYY-MM-DD"
        className="w-1/3"
      />
    </div>
  );
};

export default SearchBar;
