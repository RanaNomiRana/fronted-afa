import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles
import './additem.css'; // Import the Stylish CSS

type MessageType = string;

const Additem: React.FC = () => {
  const [itemName, setItemName] = useState<string>('');
  const [SalePricePerPiece, setSalePricePerPiece] = useState<number | ''>('');
  const [picture, setPicture] = useState<File | null>(null);

  // Event handler for file input changes
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      setPicture(event.target.files[0]);
    }
  };

  // Event handler for text input changes
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setItemName(event.target.value);
  };

  // Event handler for SalePricePerPiece input changes
  const handleSalePricePerPieceChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setSalePricePerPiece(value === '' ? '' : Number(value));
  };

  // Event handler for form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (SalePricePerPiece === '' || isNaN(SalePricePerPiece)) {
      toast.error('Please enter a valid Sale Price Per Piece.');
      return;
    }

    const formData = new FormData();
    formData.append('itemName', itemName);
    formData.append('SalePricePerPiece', SalePricePerPiece.toString());
    if (picture) {
      formData.append('picture', picture);
    }

    try {
      const response = await axios.post('http://localhost:3000/api/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Extract message from response
      const { message } = response.data;

      // Show success toast and clear fields
      toast.success(message);
      setItemName('');
      setSalePricePerPiece('');
      setPicture(null);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.error || 'Error adding item.');
      } else {
        console.error('Error submitting form:', error);
        toast.error('Error adding item.');
      }
    }
  };

  return (
    <div className="additem-form-container">
      <h2 className="additem-heading">Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="additem-form-group">
          <label htmlFor="itemName">Item Name:</label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={handleNameChange}
            required
          />
        </div>
        <div className="additem-form-group">
          <label htmlFor="SalePricePerPiece">Sale Price Per Piece:</label>
          <input
            type="number"
            id="SalePricePerPiece"
            value={SalePricePerPiece}
            onChange={handleSalePricePerPieceChange}
            required
            step="0.01"
          />
        </div>
        <div className="additem-form-group">
          <label htmlFor="picture">Upload Picture:</label>
          <input
            type="file"
            id="picture"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="additem-submit-button">Add Item</button>
      </form>
      <ToastContainer /> {/* Add the ToastContainer here */}
    </div>
  );
};

export default Additem;
