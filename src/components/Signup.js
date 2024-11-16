import React, { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";

export default function SignUp({ onSignUpSuccess, onClose }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const result = await response.json();
      console.log('response from server: ', result);
      if (response.ok) {
        setMessage(result.message);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          onSignUpSuccess(result.id);
        }, 1000);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("An error occured: " + error.message);
    }
  };

  return (
    <div className="inset-0 fixed flex justify-center items-center z-50 bg-black bg-opacity-80">
      <div className="relative w-1/4 border border-black p-9 rounded-lg bg-white bg-opacity-90">
        <button className="absolute p-1 top-2 right-2" onClick={onClose}>
          <MdOutlineCancel size={30} />
        </button>
        {showPopup && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          {message}
        </div>
      )}
        <h1 className="text-3xl font-bold mb-7 flex items-center justify-center">
          Sign Up
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
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
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
            Sign Up
          </button>
          {message && <p className="text-red-500 flex items-center justify-center">{message}</p>}
        </form>
        
      </div>
    </div>
  );
}
