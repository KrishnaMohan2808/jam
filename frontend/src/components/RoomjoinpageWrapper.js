import React from 'react';
import { useNavigate } from 'react-router-dom';
import Roomjoinpage from './Roomjoinpage'; // Import your original component

export default function RoomjoinpageWrapper(props) {
  const navigate = useNavigate();
  // Pass the navigate function as a prop
  return <Roomjoinpage {...props} navigate={navigate} />;
}