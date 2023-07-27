import React, { useState } from 'react'
import axios from 'axios';



// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const initialCoordinates = {x:0 , y:0}

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
  coordinates: initialCoordinates ,
  errorMessage: ''
  
  
 
}

export default class AppClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: initialState,
      
      
      


    }
  }

  getXY = () => {

    const index = this.state.value.index;
    const x = index % 3;
    const y = Math.floor(index / 3);
    return { x , y };
  
    
   
     }
     
     
    getXYMessage = () => {
    
      const {x , y} = this.getXY()
     
     
      return `coordinates (${x + 1}, ${y + 1})`;
      
    }



  reset = (e) => {
    e.preventDefault();
    
 this.setState({
  value: {
    ...initialState,
    coordinates: this.getXY(),
    errorMessage: ""
  }
})
    


  }

  getNextIndex = (direction) => {

  
    const x = this.state.value.index % 3;
    const y = Math.floor(this.state.value.index / 3) ;
  
    let nextX = x;
    let nextY = y;
  
    if (direction === "up" && y > 0) {
      nextY = y - 1;
    } else if (direction === "down" && y < 2) {
      nextY = y + 1;
    } else if (direction === "left" && x > 0) {
      nextX = x - 1;
    } else if (direction === "right" && x < 2) {
      nextX = x + 1;
    }
  
    const nextIndex = nextY * 3 + nextX;
    if(nextIndex >=0 && nextIndex <=8){
      this.setState({value: {...this.state.value, errorMessage: ''}})
      return nextIndex
    } else {
      this.setState({value: {...this.state.value, errorMessage:''}})
      return this.state.value.index;
    }
    

  }


  

  move = (evt) => {
    evt.preventDefault();
    const direction = evt.target.id;
    const nextIndex = this.getNextIndex(direction);

    if(nextIndex !== this.state.value.index) {
    this.setState({
      value: {
        ...this.state.value,
        index:nextIndex,
        steps: this.state.value.steps +1,  
        coordinates: this.getXY(),
        errorMessage: ""
      }
    });
        }  else {
          this.setState({ 
            
            value: {
             ...this.state.value,
              errorMessage: `You can't go ${direction}`
             }
          })
        }

   }
  
    
    
  


  onChange = (evt) => {

    const { value } = evt.target;

    this.setState({
      ...this.state,
      value: {
        ...this.state.value, email: value
      }
    })

  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
      
     const {x , y} = this.getXY()
     const key = {
      x: x + 1 ,
      y: y + 1,
      steps: this.state.value.steps,
      email: this.state.value.email
    }
    axios.post(`http://localhost:9000/api/result`, key)
      .then(res => {
        
        this.setState({
          ...this.state, value: { ...this.state.value, message: res.data.message, email: '' }
        })
       
      })
      

      .catch(err => this.setState({ ...this.state, value: { ...this.state.value, message: err.response.data.message } }))
  }

  render() {
    const { className } = this.props
    const { value } = this.state;
    const square = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    

    return (
      
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {value.steps} time{value.steps !== 1 ? 's' : ''}</h3>
        </div>
        <div id="grid">
          {
            square.map(idx => (
              <div key={idx} className={`square${idx === value.index ? ' active' : ''}`}>
                {idx === value.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{value.message}{value.errorMessage}</h3>
        </div>
        <div id="keypad">
          <button onClick={ this.move} id="left" >LEFT</button>
          <button onClick={this.move} id="up"  >UP</button>
          <button onClick={this.move} id="right">RIGHT</button>
          <button onClick={ this.move} id="down"  >DOWN</button>
          <button onClick={this.reset} id="reset" >reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email"
            type="email"
            placeholder="type email"
            onChange={this.onChange}
            value={value.email}></input>
          <input id="submit" type="submit"></input>
        </form>
          

          
          
          
          
          
         </div>
      
    )

  }
}
