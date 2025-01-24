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
    <div>
      <h2 className="mb-3">Send Email to Customer</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label>
          Recipient Email:
          <input
            type="email"
            className="w-[300px] h-5"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Subject:
          <input
            type="text"
            value={subject}
            className="w-[300px] h-5"
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Email Body:
          <textarea
            value={body}
            className="w-[450px] h-[150px]"
            onChange={(e) => setBody(e.target.value)}
            required
          ></textarea>
        </label>
        <br />
        <button className="border w-20" type="submit">
          Send Email
        </button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default Email;
