import React, { useState } from 'react';
import Select from 'react-select';
import countryList from 'react-select-country-list';

interface EditUserInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditUserInfoModal: React.FC<EditUserInfoModalProps> = ({ isOpen, onClose }) => {
    const [country, setCountry] = useState(null);
    const countries = countryList().getData();

    const handleCountryChange = (selectedOption: any) => {
        setCountry(selectedOption);
    };
    const [isBilling, setIsBilling] = useState(true);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-[90vh] overflow-y-auto p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 font-bold left-4 text-gray-400 hover:text-gray-900 border shadow hover:shadow-xl bg-gray-50 p-2 rounded-lg"
                >
                    X
                </button>
                <div className="text-center mb-6">
                    <div className="text-lg font-medium max-md:text-md">Edit User Information</div>
                    <div className="text-sm text-gray-500 mt-2">
                        Updating user details will receive a privacy audit.
                    </div>
                </div>
                <form className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    <div className="w-full">
                        <label className="block text-sm  text-gray-700 max-md:text-xsm">First Name</label>
                        <input type="text" placeholder="John" className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm  text-gray-700 max-md:text-xsm ">Last Name</label>
                        <input type="text" placeholder="Doe" className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="col-span-1 md:col-span-2 w-full">
                        <label className="block text-sm  text-gray-700 max-md:text-xsm">Username</label>
                        <input type="text" placeholder="johndoe007" className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm  text-gray-700 max-md:text-xsm">Email</label>
                        <input type="email" placeholder="example@domain.com" className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm  text-gray-700 max-md:text-xsm">Status</label>
                        <select className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Status</option>
                            <option>Active</option>
                            <option>Inactive</option>
                            <option>Suspended</option>
                        </select>
                    </div>
                    <div className="w-full">
                        <label className="block text-sm text-gray-700 max-md:text-xsm">Tax ID</label>
                        <input type="text" placeholder="123 456 7890" className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="w-full">
                        <label className="block text-sm text-gray-700 max-md:text-xsm">Phone Number</label>
                        <div className="flex">
                            <select className="block px-4 py-2 border rounded-l-md">
                                <option>US (+1)</option>
                                <option>PK (+92)</option>
                            </select>
                            <input type="text" placeholder="202 555 0111" className="block w-full px-4 py-2 border rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <div className="w-full">
                        <label className="block text-sm text-gray-700 max-md:text-xsm">Language</label>
                        <select className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Select</option>
                            <option>English</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                            <option>Dutch</option>
                            <option>Hebrew</option>
                            <option>Sanskrit</option>
                            <option>Hindi</option>
                        </select>
                    </div>
                    <div className="w-full">
                        <label className="block text-sm text-gray-700 max-md:text-xsm">Country</label>
                        <Select
                            options={countries}
                            value={country}
                            onChange={handleCountryChange}
                            className="mt-1"
                            placeholder="Select a country"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2 flex items-center w-full">

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
                    <div className="col-span-1 md:col-span-2 flex justify-center space-x-4 mt-6 w-full">
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

export default EditUserInfoModal;
