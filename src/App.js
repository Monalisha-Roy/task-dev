import React, { useEffect, useState, useTransition } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Login from './components/Login';
import SignUp from './components/Signup';
import NavbarLoggedIn from './components/NavbarLoggedIn';
import Form from './components/form';

function App() {
  const [isLoginVisible, setIsLoginVisible] = React.useState(false);
  const [isSignUpVisible, setIsSignUpVisible] = React.useState(false);
  const [isAddPostVisible, setIsAddPostVisible] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [logoutMessageVisible, setLogoutMessageVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Passing the token: ', token);
        const response = await fetch('http://localhost:3001/api/data', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        });
        const result = await response.json();
        console.log('Response from server: ', result);
        if (response.ok) {
          setId(result.id);
          setUsername(result.username);
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.log('Error fetching userdata: ', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLoginClick = () => {
    setIsLoginVisible(true);
    setIsSignUpVisible(false);
  }

  const handleClose = () => {
    setIsLoginVisible(false);
    setIsSignUpVisible(false);
    setIsAddPostVisible(false);
  }

  const handleSignUpClick = () => {
    setIsSignUpVisible(true);
    setIsLoginVisible(false);
  }

  const handleAddPost = () => {
    setIsAddPostVisible(true);
  }

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    handleClose();
  }
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setLogoutMessageVisible(true);
    setTimeout(() => {
      setLogoutMessageVisible(false);
    }, 2000);
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      {isLoggedIn ? (
        <>
          <NavbarLoggedIn onAddPostClick={handleAddPost} onLogoutClick={handleLogout} username={username}/>
          {isAddPostVisible && <Form onClose={handleClose} user_id={id}/>}
        </>
      ) : (
        <>
        <Navbar onLoginClick={handleLoginClick} onSignUpClick={handleSignUpClick}/>
        {isLoginVisible && <Login onLoginSuccess={handleLoginSuccess} onClose={handleClose}/>}
        {isSignUpVisible && <SignUp onClose={handleClose}/>}
        </>
      )}
      {logoutMessageVisible && (
        <div className="fixed top-2 right-2/4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
        User logged out successfully
      </div>
      )}
      <h1 className='text-black font-bold px-32 text-4xl mt-9'>Public Blogs.</h1>
      <main className="flex-grow flex justify-center items-center py-9">
        <div className='border border-black w-10/12 flex flex-col gap-3 justify-center items-center rounded-xl py-10'>
            <div className='bg-pink-500 text-white w-11/12 p-5  h-40 flex justify-center items-center text-xxl font-bold rounded-lg'>Blog 1</div>
            <div className='bg-pink-500 text-white w-11/12 p-5 h-40 flex justify-center items-center text-xxl font-bold rounded-lg'>Blog 2</div>
            <div className='bg-pink-500 text-white w-11/12 p-5 h-40 flex justify-center items-center text-xxl font-bold rounded-lg'>Blog 3</div>
            <div className='bg-pink-500 text-white w-11/12 p-5 h-40 flex justify-center items-center text-xxl font-bold rounded-lg'>Blog 4</div>
            <div className='bg-pink-500 text-white w-11/12 p-5 h-40 flex justify-center items-center text-xxl font-bold rounded-lg'>...</div>
        </div>
      </main>
    </div>
  );
}

export default App;