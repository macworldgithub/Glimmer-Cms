import React, { useState } from 'react';
import { MdOutlineLocalPostOffice } from "react-icons/md";
import { TiHomeOutline } from "react-icons/ti";
import Select from 'react-select';
import countryList from 'react-select-country-list';


interface AddAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddNewAddress: React.FC<AddAddressModalProps> = ({ isOpen, onClose }) => {
    const [country, setCountry] = useState(null);
        const countries = countryList().getData();
    
        const handleCountryChange = (selectedOption: any) => {
            setCountry(selectedOption);
        };
    const [isBilling, setIsBilling] = useState(true);
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 min-h-screen">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 font-bold left-4 text-gray-400 hover:text-gray-900 border shadow hover:shadow-xl bg-gray-50 p-2 rounded-lg"
                >
                    X
                </button>
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-lg font-medium max-md:text-md">Add New Address</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Add new address for express delivery
                    </p>
                </div>


                <div className="flex items-center justify-center gap-6 mt-4 max-sm:block">
                    <div className="flex gap-2">
                        <input
                            type="radio"
                            name="addressType"
                            value="residential"

                        />
                        <TiHomeOutline size={18} />
                        <label className="flex items-center cursor-pointer text-[12px] "> Home Delivery time (9am – 9pm)</label>
                    </div>
                    <div className="flex gap-2 max-sm:mt-2">
                        <input
                            type="radio"
                            name="addressType"
                            value="residential"

                        />
                        <MdOutlineLocalPostOffice size={18} />
                        <label className="flex items-center cursor-pointer  text-[12px]">  Office Delivery time (9am – 5pm)</label>
                    </div>
                </div>
                <form className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-600 mb-2">First Name</label>
                            <input
                                type="text"
                                placeholder="First Name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-2">Last Name</label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-600 mb-2">Country</label>
                        <Select
                            options={countries}
                            value={country}
                            onChange={handleCountryChange}
                            className="mt-1"
                            placeholder="Select a country"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-600 mb-2">Address Line 1</label>
                        <input
                            type="text"
                            placeholder="Address Line 1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-600 mb-2">Address Line 2</label>
                        <input
                            type="text"
                            placeholder="Address Line 2"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-600 mb-2">Landmark</label>
                            <input
                                type="text"
                                placeholder="Landmark"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-2">City</label>
                            <input
                                type="text"
                                placeholder="City"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-600 mb-2">State</label>
                            <input
                                type="text"
                                placeholder="State"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-2">Zip Code</label>
                            <input
                                type="text"
                                placeholder="Zip Code"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 flex items-center w-full mt-4">

                        <div
                            className={`relative inline-block w-10 h-5 rounded-full cursor-pointer ${isBilling ? "bg-[#5F61E6]" : "bg-gray-300"
                                }`}
                            onClick={() => setIsBilling(!isBilling)}
                        >
                            <span
                                className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow transition-transform ${isBilling ? "translate-x-6" : "translate-x-1"
                                    }`}
                            ></span>
                        </div>

                        <label htmlFor="billingAddress" className="ml-2 text-sm text-gray-700 ">
                            Use as a billing address?
                        </label>
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-4">
                        <button type="submit" className="bg-[#5f61e6] text-white px-4 py-2 rounded-md">
                            Submit
                        </button>
                        <button type="button" className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewAddress;
