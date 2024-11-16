export default function NavbarLoggedIn({ onAddPostClick, onLogoutClick, username, email }) {
  
  return (
    <nav className="w-full px-6 py-2 bg-gray-600 flex justify-between items-center">
      <div className="bg-pink-600 p-2 rounded-full w-16 h-16 flex items-center justify-center">
        <p className="text-bold text-white">Profile</p>
      </div>
      <div className="flex-col justify-start items-start p-2 w-2/5 rounded-md bg-green-300">
        <p className="text-gray-700 font-semibold text-md px-5">Username: {username}</p>
        <p className="text-gray-700 font-semibold text-md px-5">Email: {email}</p>
      </div>
      <div className="flex justify-center items-center gap-3">
      <button
          onClick={onAddPostClick}
          className="text-white px-5 py-3 bg-pink-600 hover:bg-pink-500 rounded-lg flex justify-center items-center"
        >
          + Add Post
        </button>
        <button 
          onClick={onLogoutClick}
          className="text-white px-5 py-3 bg-pink-600 hover:bg-pink-500 rounded-lg flex justify-center items-center">
            Logout
        </button>
      </div>
    </nav>
  );
}