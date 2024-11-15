import React, { useState } from 'react';
import { MdOutlineCancel } from "react-icons/md";

export default function Form({ onClose, user_id }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const date = new Date().toISOString().split('T')[0];
    try {
      console.log('userId: ', user_id);
      const response = await fetch("http://localhost:3001/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, title, subject, date, content }),
      });
      console.log(response.body);
      const result = await response.json();
      if (response.ok) {
        setMessage(result.message);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          onClose();
        }, 2000);
        
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.log("An Error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-80">
      <div className="relative w-full max-w-md mx-auto mt-10 p-5 border border-gray-300 rounded-lg shadow-lg bg-white">
        <button className="absolute p-1 top-2 right-2" onClick={onClose}>
          <MdOutlineCancel size={30} />
        </button>
        {showPopup && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          {message}
          <p>id: {user_id}</p>
        </div>
      )}
        <h2 className="text-2xl font-bold mb-5 text-center">Create a Post</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Text</label>
            <textarea
              
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows="4"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            id: {user_id}
            Post
          </button>
        </form>
      </div>
    </div>
  );
}