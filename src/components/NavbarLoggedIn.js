import React, { useEffect, useState } from "react";

export default function NavbarLoggedIn({ onAddPostClick, onLogoutClick, username }) {
  
  return (
    <nav className="w-full px-6 py-2 bg-gray-600 flex justify-between items-center">
      <div className="bg-pink-600 p-2 rounded-full w-16 h-16 flex items-center justify-center">
        <p className="text-bold text-white">Profile</p>
      </div>
      <div className="flex-col justify-center items-center p-2 rounded-md bg-green-400">
        <p className="text-white text-md px-5">{username}</p>
        <p className="text-white text-md px-5">mail@gamil.cjom</p>
      </div>
      <div className="flex justify-center items-center gap-3">
      <button
          onClick={onAddPostClick}
          className="text-white px-5 py-3 bg-pink-600 hover:bg-pink-500 rounded-lg flex justify-center items-center"
        >
          + ADD POST
        </button>
        <button 
          onClick={onLogoutClick}
          className="text-white px-5 py-3 bg-pink-600 hover:bg-pink-500 rounded-lg flex justify-center items-center">
            LOGOUT
        </button>
      </div>
    </nav>
  );
}