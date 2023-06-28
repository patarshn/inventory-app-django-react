import React, { useEffect, useState } from 'react';
import BaseTable from '../BaseTable';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const userRole = Cookies.get('userRole');
    const [inventoryData, setInventoryData] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');  // Retrieve the access token from the cookie
    if (!token) {
      navigate('/login');
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;


    useEffect(() => {
      
    fetchData();
    }, []);

    const fetchData = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/inventories/');
        if (response.data.success) {
        setInventoryData(response.data.data);
        }
    } catch (error) {
        console.error('Error fetching inventory data:', error);
    }
    };


  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Admin</h2>
      <div className="flex justify-center items-center">
        <div>
          <BaseTable data={inventoryData} role={userRole} />
        </div>
      </div>
    </div>
  );
};

export default Admin;