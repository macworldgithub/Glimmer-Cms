import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { sendEmail } from "../api/email/api";

const Email: React.FC = () => {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");


  const token = useSelector((state:RootState)=>state.Login.token)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipient || !subject || !body) {
      setStatus("Please fill out all fields.");
      return;
    }

    try {
      const response = await sendEmail(recipient,subject,body,token)

      if (response) {
        setStatus("Email sent successfully!");
        setRecipient("");
        setSubject("");
        setBody("");
      } else {
        setStatus("Failed to send email. Try again.");
      }
    } catch (error) {
      setStatus("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
      Send Email to Customer
    </h2>
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="text-gray-700 font-medium">
        Recipient Email:
        <input
          type="email"
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
      </label>
  
      <label className="text-gray-700 font-medium">
        Subject:
        <input
          type="text"
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </label>
  
      <label className="text-gray-700 font-medium">
        Email Body:
        <textarea
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none h-32"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        ></textarea>
      </label>
  
      <button
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        type="submit"
      >
        Send Email
      </button>
    </form>
  
    {status && <p className="text-center text-green-500 mt-3">{status}</p>}
  </div>
  );
};

export default Email;
