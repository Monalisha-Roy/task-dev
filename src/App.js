import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import NavbarLoggedIn from "./components/NavbarLoggedIn";
import Form from "./components/form";

function App() {
  const [isLoginVisible, setIsLoginVisible] = React.useState(false);
  const [isSignUpVisible, setIsSignUpVisible] = React.useState(false);
  const [isAddPostVisible, setIsAddPostVisible] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [logoutMessageVisible, setLogoutMessageVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [publicPosts, setPublicPosts] = useState([]);
  const [personalBlogs, setPersonalBlogs] = useState([]);
  const [showPublicPosts, setShowPublicPosts] = useState(true);
  const [showPersonalBlogs, setShowPersonalBlogs] = useState(false);

  useEffect(() => {
    fetchPublicPostData();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem('id', id);
    if (token && userId) {
      setIsLoggedIn(true);
      fetchUserData(token);
      fetchPersonalBlogs(userId);
      setId(userId);
      setShowPersonalBlogs(true);
      setShowPublicPosts(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:3001/api/data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const result = await response.json();
      if (response.ok) {
        setId(result.id);
        setUsername(result.username);
        setEmail(result.email);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.log("Error fetching userdata: ", error);
    }
  };

  const fetchPublicPostData = async () => {
    try {
      const response = await fetch("http://localhost:3001/publicpost", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.ok) {
        setPublicPosts(result);
      } else {
        console.log(result.error);
      }
    } catch (error) {
      console.log("Error fetching public postsData: ", error);
    }
  };

  const fetchPersonalBlogs = async (token) => {
    try {
      const response = await fetch("http://localhost:3001/privatepost", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
      });
      const result = await response.json();
      if (response.ok) {
        setPersonalBlogs(result);
      } else {
        console.log(result.error);
      }
    } catch (error) {
      console.log("Error fetching personal blogs: ", error);
    }
  };

  const handleLoginClick = () => {
    setIsLoginVisible(true);
    setIsSignUpVisible(false);
  };

  const handleClose = () => {
    setIsLoginVisible(false);
    setIsSignUpVisible(false);
    setIsAddPostVisible(false);
  };

  const handleSignUpClick = () => {
    setIsSignUpVisible(true);
    setIsLoginVisible(false);
  };

  const handleAddPost = () => {
    setIsAddPostVisible(true);
  };

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    localStorage.setItem('id', token);
    setId(token);
    setIsLoggedIn(true);
    fetchPersonalBlogs(token);
    fetchUserData(token);
    setShowPersonalBlogs(true);
    setShowPublicPosts(false);
    handleClose();
  };

  const handleSignUpSuccess = (token) => {
    setIsLoggedIn(true);
    setId(token);
    localStorage.setItem('token', token);
    localStorage.setItem('id', token);
    fetchUserData(token);
    fetchPersonalBlogs(token);
    setShowPersonalBlogs(true);
    setShowPublicPosts(false);
    handleClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem('id');
    setIsLoggedIn(false);
    setLogoutMessageVisible(true);
    setShowPersonalBlogs(false);
    setShowPublicPosts(true);
    fetchPublicPostData();
    setTimeout(() => {
      setLogoutMessageVisible(false);
    }, 2000);
  };

  const handleRefresh = () => {
    fetchPersonalBlogs(id);
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      {isLoggedIn ? (
        <>
          <NavbarLoggedIn
            onAddPostClick={handleAddPost}
            onLogoutClick={handleLogout}
            username={username}
            email={email}
          />
          {isAddPostVisible && <Form onClose={handleClose} user_id={id} />}
        </>
      ) : (
        <>
          <Navbar
            onLoginClick={handleLoginClick}
            onSignUpClick={handleSignUpClick}
          />
          {isLoginVisible && (
            <Login onLoginSuccess={handleLoginSuccess} onClose={handleClose} />
          )}
          {isSignUpVisible && (
            <SignUp
              onSignUpSuccess={handleSignUpSuccess}
              onClose={handleClose}
            />
          )}
        </>
      )}
      {logoutMessageVisible && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          User logged out successfully
        </div>
      )}
      <div className="md:hidden flex flex-col justify-start items-center p-2 px-14 w-full rounded-md bg-green-100">
        <p className="text-gray-700 font-semibold text-md px-5">Username: {username}</p>
        <p className="text-gray-700 font-semibold text-md px-5">Email: {email}</p>
      </div>
      {showPublicPosts && (
        <>
          <h1 className="text-black font-bold px-14 md:px-32 text-4xl mt-9">
            Public Blogs.
          </h1>
          <main className="flex-grow flex justify-center items-center py-9">
            <div className="border border-black w-10/12 flex flex-col gap-3 justify-center items-center rounded-xl py-5">
              {publicPosts.map((post, index) => (
                <div
                  key={index}
                  className="bg-pink-500 text-white w-11/12 p-5 h-auto flex-col justify-center items-center text-xxl rounded-lg"
                >
                  <p>Username: {post.username}</p>
                  <p>Date: {post.date}</p>
                  <p>Content: {post.content}</p>
                </div>
              ))}
            </div>
          </main>
        </>
      )}
      {showPersonalBlogs && (
        <>
          <div className="flex justify-between items-baseline w-11/12">
          <h1 className="text-black font-bold px-14 md:px-32 text-4xl mt-9">
            My Blogs.
          </h1>
          <button onClick={handleRefresh} className="p-2 w-20 bg-slate-500 text-white rounded-md hover:bg-slate-800">Refresh</button>
          </div>
          
          <main className="flex-grow flex justify-center py-9">
            <div className="border border-black w-10/12 flex flex-col gap-3 justify-items-start items-center py-5 rounded-xl">
              {personalBlogs.length === 0 ? (
                <h1 className="flex justify-center items-center h-full text-3xl">NO BLOG POSTS YET.</h1>
              ) : (
                personalBlogs.map((post, index) => (
                  <div
                    key={index}
                    className="bg-pink-500 text-white w-11/12 p-5 h-auto flex-col justify-center items-center text-xxl rounded-lg"
                  >
                    <p>Username: {post.username}</p>
                    <p>Date: {post.date}</p>
                    <p>Content: {post.content}</p>
                  </div>
                ))
              )}
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
