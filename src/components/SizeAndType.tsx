"use client";
import React, { useEffect } from "react";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";

interface SizeAndType {
  sizes: any[]; // Assuming sizes is an array of strings (update as per your data type)
  types: any[]; // Assuming types is an array of strings (update as per your data type)
  setSizes: React.Dispatch<React.SetStateAction<any[]>>;
  setTypes: React.Dispatch<React.SetStateAction<any[]>>;

  HandleChange: any;
}

const SizeAndType = ({
  sizes,
  types,
  setSizes,
  setTypes,
  HandleChange,
}: SizeAndType) => {
  const product = useSelector((state: RootState) => state.AddProduct);
  const addSizeField = () => {
    setSizes([...sizes, { id: sizes.length + 1, value: "", unit: "mg" }]);
  };

  const addTypeField = () => {
    setTypes([...types, { id: types.length + 1, value: "" }]);
  };

  const removeSizeField = (id) => {
    setSizes((prevSizes) =>
      prevSizes.length > 1
        ? prevSizes.filter((size) => size.id !== id)
        : [{ id: 1, value: "0", unit: "mg" }]
    );
  };

  const removeTypeField = (id) => {
    setTypes((prevTypes) =>
      prevTypes.length > 1
        ? prevTypes.filter((type) => type.id !== id)
        : [{ id: 1, value: "0" }]
    );
  };

  const handleSizeChange = (id, key, value) => {
    setSizes((prevSizes) =>
      prevSizes.map((size) =>
        size.id === id ? { ...size, [key]: value } : size
      )
    );
    // HandleChange(`size_${id}`, value);
  };

  const handleTypeChange = (id, value) => {
    setTypes((prevTypes) =>
      prevTypes.map((type) => (type.id === id ? { ...type, value } : type))
    );
    // HandleChange(`type_${id}`, value);
  };

  useEffect(() => {
    HandleChange("type", types);
    HandleChange("size", sizes);
  }, [types, sizes]);

  useEffect(() => {
    console.log("looo check", product);
  }, [product]);

  return (
    <div className="max-lg:w-full">
      <div className="p-6 bg-white rounded-md my-4 shadow-md">
        <h2 className="text-lg font-medium mb-4">Size & Type</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Size
          </label>
          {sizes.map((size, index) => (
            <div key={size.id} className="flex items-center gap-2 mb-2">
              <input
                type="number"
                placeholder={`Size ${index + 1}`}
                className="w-full rounded-md shadow-sm p-3 border border-gray-400"
                value={size.value}
                onChange={(e) =>
                  handleSizeChange(size.id, "value", e.target.value)
                }
              />
              <select
                className="p-3 border border-gray-400 rounded-md"
                value={size.unit}
                onChange={(e) =>
                  handleSizeChange(size.id, "unit", e.target.value)
                }
              >
                <option value="mg">mg</option>
                <option value="kg">kg</option>
                <option value="l">l</option>
              </select>
              <button onClick={() => removeSizeField(size.id)} className="ml-2">
                -
              </button>
            </div>
          ))}
          <button onClick={addSizeField} className="mt-2">
            + Add Size
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          {types.map((type, index) => (
            <div key={type.id} className="mb-2">
              <input
                type="text"
                placeholder={`Type ${index + 1}`}
                className="w-full rounded-md shadow-sm p-3 border border-gray-400"
                value={type.value}
                onChange={(e) => handleTypeChange(type.id, e.target.value)}
              />
              <button onClick={() => removeTypeField(type.id)} className="ml-2">
                -
              </button>
            </div>
          ))}
          <button onClick={addTypeField} className="mt-2">
            + Add Type
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeAndType;
