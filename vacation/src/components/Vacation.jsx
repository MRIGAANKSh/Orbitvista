import React from 'react';
import vacationBg from '../assets/gradient.svg'; 
import Header from './Header';

function Vacation() {
  return (
    <div
      className="w-full min-h-screen bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${vacationBg})` }}
    >
      <Header />
    </div>
  );
}

export default Vacation;
