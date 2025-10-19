import React from 'react';
import { useNavigate } from 'react-router-dom';
import Createroompage from './Createroompage'; // Import your original component

export default function CreateroompageWrapper(props) {
  const navigate = useNavigate();
  // Pass the navigate function as a prop
  return <Createroompage {...props} navigate={navigate} />;
}