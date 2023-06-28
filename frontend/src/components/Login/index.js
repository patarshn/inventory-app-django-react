import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });

      // Check if the authentication was successful
      if (response.status === 200) {
        // Save the access token to local storage
        const accessToken = response.data.access;
        localStorage.setItem('accessToken', accessToken);

        // Set the token in the Axios request headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

        // Fetch the user profile data
        const profileResponse = await axios.get(
          'http://localhost:8000/api/users/getProfile/'
        );

        // Get the user's role from the profile response
        const userRole = profileResponse.data.data.role;
        Cookies.set('userRole', userRole); // Save user role in cookie


        // Redirect to the appropriate route based on the role
        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      }
    } catch (error) {
      // Handle login error here
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="max-w-sm w-full">
        <div className="flex flex-col gap-4">
          <label htmlFor="username" className="font-bold">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded p-2"
          />
          <label htmlFor="password" className="font-bold">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
