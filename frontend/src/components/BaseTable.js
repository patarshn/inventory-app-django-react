import React from 'react';

const BaseTable = ({ data, role, handleEditClick, handleDeleteClick }) => {
  return (
    <table className="">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">ID</th>
          <th className="py-2 px-4 border-b">Name</th>
          <th className="py-2 px-4 border-b">Description</th>
          <th className="py-2 px-4 border-b">Quantity</th>
          {role === 'admin' && <th className="py-2 px-4 border-b">Action</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.pk}>
            <td className="py-2 px-4 border-b">{item.pk}</td>
            <td className="py-2 px-4 border-b">{item.name}</td>
            <td className="py-2 px-4 border-b">{item.description}</td>
            <td className="py-2 px-4 border-b">{item.quantity}</td>
            {role === 'admin' && (
              <td className="py-2 px-4 border-b">
                <button
                  className="mr-2 text-blue-500"
                  onClick={() => handleEditClick(item.pk)}
                >
                  Update
                </button>
                <button
                 className="text-red-500"
                 onClick={() => handleDeleteClick(item.pk)}
                 >Delete</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BaseTable;
