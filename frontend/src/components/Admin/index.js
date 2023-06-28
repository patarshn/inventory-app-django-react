import React, { useEffect, useState } from 'react';
import BaseTable from '../BaseTable';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const Admin = () => {
  const userRole = Cookies.get('userRole');
  const [inventoryData, setInventoryData] = useState([]);
  const [editedData, setEditedData] = useState({
    name: '',
    description: '',
    quantity: 0,
  });
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [selectEditedItemId, setSelectEditedItemId] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    quantity: 0,
  });
  const [showModalAdd, setShowModalAdd] = useState(false);

  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectDeletedItemId, setSelectDeletedItemId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken'); // Retrieve the access token from the cookie
  if (!token) {
    navigate('/login');
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('http://localhost:8000/api/inventories/');
      if (response.data.success) {
        setInventoryData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };

  const handleInputChangeAdd = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

    const handleAddItem = async (e) => {
      e.preventDefault(); 
    try {
      const response = await axiosInstance.post('/inventories/', newItem);
      console.log(response);
      if (response.data.success) {
        // Reset the form
        setNewItem({
          name: '',
          description: '',
          quantity: 0,
        });
        // Fetch data again to reflect the changes
        fetchData();
        setShowModalAdd(false);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      // Handle error
    }
  };

  const handleEditClick = (itemId) => {
    const selectedItem = inventoryData.find((item) => item.pk === itemId);
    setEditedData({
      name: selectedItem.name,
      description: selectedItem.description,
      quantity: selectedItem.quantity,
    });
    setSelectEditedItemId(itemId);
    setShowModalUpdate(true);
  };

  const handleInputChangeUpdate = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  

  const handleFormSubmitUpdate = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axiosInstance.put(
        `/inventories/${selectEditedItemId}/`,
        editedData
      );
      if (response.data.success) {
        // Update the inventoryData state or fetch data again to reflect the changes
        setShowModalUpdate(false);
        const updatedInventoryData = inventoryData.map((item) => {
          if (item.pk === selectEditedItemId) {
            return {
              ...item,
              name: editedData.name,
              description: editedData.description,
              quantity: editedData.quantity,
            };
          }
          return item;
        });
        setInventoryData(updatedInventoryData);
      }
    } catch (error) {
      console.error('Error updating inventory data:', error);
      // Handle error
    }
  };

  const handleDeleteClick = (itemId) => {
    setSelectDeletedItemId(itemId);
    setShowModalDelete(true);
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await axiosInstance.delete(`/inventories/${itemId}/`);
      if (response.data.success) {
        // Fetch data again to reflect the changes
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      // Handle error
    }
  };

  const confirmDelete = () => {
    handleDelete(selectDeletedItemId);
    setShowModalDelete(false);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Admin</h2>
      <div className="flex justify-center items-center">
        <div>
        <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        onClick={() => setShowModalAdd(true)}
      >
        Add Items
      </button>
          <BaseTable data={inventoryData} role={userRole} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick}/>
        </div>
      </div>
      {showModalUpdate && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-md border-solid border-red-500">
            <h3 className="text-lg font-bold mb-4">Edit Item</h3>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleFormSubmitUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" name="name" type="text" value={editedData.name}
                  onChange={handleInputChangeUpdate}/>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                  Description
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" name="description" type="text" value={editedData.description}
                  onChange={handleInputChangeUpdate}/>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                  Quantity
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="quantity" name="quantity" type="number" value={editedData.quantity}
                  onChange={handleInputChangeUpdate}/>
              </div>
              <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{showModalAdd && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md">
            <h3 className="text-lg font-bold mb-4">Add Item</h3>
            <form onSubmit={handleAddItem}>
              <div className="mb-2">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChangeAdd}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={newItem.description}
                  onChange={handleInputChangeAdd}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={newItem.quantity}
                  onChange={handleInputChangeAdd}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2"
              >
                Save
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 ml-2"
                onClick={() => setShowModalAdd(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}


{showModalDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p>Are you sure you want to delete this item?</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 mr-2"
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2"
                onClick={() => setShowModalDelete(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
