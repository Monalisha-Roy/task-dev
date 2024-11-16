import React, { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";

export default function Login({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        setShowPopup(true); 
        setTimeout(() => {
          setShowPopup(false);
          onLoginSuccess(result.token);
          onClose();
        }, 1000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-80">
      <div className="relative w-1/4 border border-black p-9 rounded-lg bg-white bg-opacity-90">
        <button className="absolute p-1 top-2 right-2" onClick={onClose}>
          <MdOutlineCancel size={30} />
        </button>
        <h1 className="text-3xl font-bold mb-7 flex items-center justify-center">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="border border-gray-400 p-2 rounded-lg"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="border border-gray-400 p-2 rounded-lg"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg"
          >
            Login
          </button>
          {error && <p className="text-red-500 flex items-center justify-center">{error}</p>}
        </form>
        {showPopup && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
            User logged in successfully!
          </div>
        )}
      </div>
    </div>
  );
}