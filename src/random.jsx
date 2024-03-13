import React, { useState } from "react";

const RandomNumberGenerator = () => {
  const [randomNumber, setRandomNumber] = useState(null);

  const generateRandomNumber = () => {
    const random = Math.floor(Math.random() * 100) + 1; // Generate random number between 1 and 100
    setRandomNumber(random);
  };

  return (
    <div>
      <button onClick={generateRandomNumber}>Generate Random Number</button>
      {randomNumber && <p>Random Number: {randomNumber}</p>}
    </div>
  );
};

export default RandomNumberGenerator;
