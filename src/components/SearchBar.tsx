import { DatePicker, Input, Select } from "antd";
import { useState } from "react";

interface SearchBarProps {
    onSearch: (filters: {
        name?: string;
        category?: string;
        created_at?: string;
    }) => void;
    categories: { name: string; id: string }[];
    hideName?: boolean;
    hideCreatedAt?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    categories,
    hideName = true,
    hideCreatedAt = true,
}) => {
    const [filters, setFilters] = useState<{
        name?: string;
        category?: string;
        created_at?: string;
    }>({});

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
            {!hideName && (
                <Input
                    placeholder="Search by Name"
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    allowClear
                    className="w-1/3"
                />
            )}

            <Select
                placeholder="Filter by Category"
                onChange={(value) => handleInputChange("category", value)}
                allowClear
                className="w-1/3"
            >
                {categories.map((cat) => (
                    <Select.Option key={cat.id} value={cat.id}>
                        {cat.name}
                    </Select.Option>
                ))}
            </Select>

            {!hideCreatedAt && (
                <DatePicker
                    placeholder="Filter by Created Date"
                    onChange={handleDateChange}
                    format="YYYY-MM-DD"
                    className="w-1/3"
                />
            )}
        </div>
    );
};

export default SearchBar;
