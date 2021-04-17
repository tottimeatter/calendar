import { Component } from 'react';
import './popup.css'

class Popup extends Component {
    render() {
      return (
        <div className='popup'>
          <div className='popup_inner'>
          <div className="closePopup" onClick={this.props.reminder ? this.props.closeReminder : this.props.closePopup}><div className="close"></div></div>
            <h2>{this.props.text}</h2>
            {this.props.reminder ? <PopUpReminder reminder={this.props.reminder} deleteReminder={this.props.deleteReminder}/> : <PopUpForm closePopup={this.props.closePopup}/>}
          {/* <button onClick={this.props.closePopup}>Create reminder</button> */}
          </div>
        </div>
      );
    }
  }

  class PopUpForm extends Component {
    constructor(props){
      super(props);
      this.state = {
        // TODO Fer que el dia/hora actuals surtin com a default
        //"2021-01-27T19:25" 
        when: new Date().toISOString(),
        color: "#000000"
      }
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
    }
    handleInputChange(event){
      const target = event.target;
      const value = target.value;
      const name = target.name;
  
      this.setState({
        [name]: value
      });
    }
    handleBlur(event){
      const data = null;

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
          console.log(this.responseText);
        }
      });
      console.log(event.target.value)
      xhr.open("GET", `https://community-open-weather-map.p.rapidapi.com/weather?q=${event.target.value}%2C%20es&lat=0&lon=0&callback=test&id=2172797&lang=null&units=%22metric%22&mode=xml%2C%20html`);
      xhr.setRequestHeader("x-rapidapi-key", "8f44acada3msh175d13ed341cd8ap1fe062jsn64f16618a687");
      xhr.setRequestHeader("x-rapidapi-host", "community-open-weather-map.p.rapidapi.com");

      xhr.send(data);
    }
    handleSubmit = (event) => {
      event.preventDefault();
      // TODO Form verification
      this.props.closePopup(this.state);
    }
    render (){
      return(
        <form className="popup-form" onSubmit={this.handleSubmit}>
          <label>✍ Description</label>
          <div>
            <input name="description" 
              value={this.state.description} 
              onChange={this.handleInputChange} 
              className="input" 
              type="text"/>
            <input name="color" 
              value={this.state.color} 
              onChange={this.handleInputChange} 
              type="color"/>
          </div>
          <label>📅 When?</label>
          <input name="when" 
            value={this.state.when} 
            onChange={this.handleInputChange} 
            className="input" 
            type="datetime-local"/>
          <label>🌍 Where?</label>
          <input name="where" 
            value={this.state.where} 
            onChange={this.handleInputChange}
            onBlur={this.handleBlur}
            className="input" 
            type="text"/>
          <input type="submit" value="New reminder"/>
        </form>
      )
     }
  }

  class PopUpReminder extends Component {
    render(){
      return (
        <div>
          <div>
            <span>{this.props.reminder.description}</span> 
          </div>
          <button className="delete-reminder" onClick={this.props.deleteReminder}>Delete</button>
        </div>
      )
    }
  }

  export default Popup;