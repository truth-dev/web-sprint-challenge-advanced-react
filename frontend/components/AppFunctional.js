import React, { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const initialCoordinates = { x: 0, y: 0 }
const initialSquare = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export default function AppFunctional(props) {

  

    const [message, setMessage] = useState(initialMessage);
    const [email, setEmail] = useState(initialEmail);
      const [steps, setSteps] = useState(initialSteps);
    const [index, setIndex] = useState(initialIndex);
    const [coordinates, setCoordinates] = useState(initialCoordinates);
    const [errorMessage, setErrorMessage] = useState('');
    const [square, setSquare] = useState(initialSquare)

  function getXY() {
    const x = index % 3;
    const y = Math.floor(index / 3);
    return {x , y};
  }

  function getXYMessage() {
    const { x, y } = getXY();
    return `coordinates (${x + 1}, ${y + 1})`;
  }

  function reset() {
   
   
    // const { x, y } = getXY();
    // setCoordinates({ x, y });
    // setSteps(0);
    // setErrorMessage('');

    setCoordinates(initialCoordinates)
    setSteps(initialSteps)
    setErrorMessage('')
    setIndex(initialIndex)
    setEmail(initialEmail)
   

  }

  function getNextIndex(direction) {
    const x = index % 3;
    const y = Math.floor(index / 3);

   

    let nextX = x;
    let nextY = y;
   

    if (direction === 'up' && y > 0) {
      nextY = y - 1;
    } else if (direction === 'down' && y < 2) {
      nextY = y + 1;
    } else if (direction === 'left' && x > 0) {
      nextX = x - 1;
    } else if (direction === 'right' && x < 2) {
      nextX = x + 1;
    }
    const nextIndex = nextY * 3 + nextX;
    

    if (nextIndex >= 0 && nextIndex <= 8) {
      setErrorMessage('');
      return nextIndex;
    } else {
      setErrorMessage('');
      return index;
    }

 
  }

  function move(evt) {
   
    const direction = evt.target.id;
    const nextIndex = getNextIndex(direction);
    if (nextIndex !== index) {
      setCoordinates(getXY());
      setIndex(nextIndex);
      setSteps(steps + 1);
      setErrorMessage('');
      
    
   
    } else {
      setErrorMessage(`You can't go ${direction}`)
    }
  }

  function onChange(evt) {
    const { value } = evt.target;
    setEmail(value);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const { x, y } = getXY();
    const key = {
      x: x + 1,
      y: y + 1,
      steps: steps,
      email: email,
    };
    axios
      .post(`http://localhost:9000/api/result`, key)
      .then((res) => {
        setMessage(res.data.message);
        setEmail(initialEmail)
        
        
      })
      .catch((err) => setMessage(err.response.data.message));
  }

  

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} time{steps !== 1 ? 's' : ''}</h3>
      </div>
      <div id="grid">
        {
          square.map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}{errorMessage}</h3>
      </div>
      <div id="keypad">
        <button onClick={move} id="left">LEFT</button>
        <button onClick={move} id="up">UP</button>
        <button onClick={move} id="right">RIGHT</button>
        <button onClick={move} id="down">DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email"
          type="email"
          placeholder="type email"
          onChange={onChange}
          value={email}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
