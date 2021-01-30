import './App.css';
import { Component } from 'react';

import Popup from './components/popup';
import Calendar from './components/calendar'

class App extends Component {
  constructor(){
    super();
    this.state = {
      showPopup: false,
      reminders: []
    }
  }
  /**
   * React lifecycle function. Triggered when the component is rendered
   */
  componentDidMount(){
    this.getData()
  }
  /**
   * Open close the popup
   */
  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
  /**
   * Send new reminder to the DB
   * @param formResult data from the "new reminder" popup
   */
  sendData(formResult){
    const newReminderKey = this.props.firebase.database().ref().child('reminders').push().key;
    this.writeReminderData(newReminderKey,formResult.color,formResult.description, formResult.when, formResult.where)
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
  /**
   * Fetch data from the database
   */
  getData(){
    let DBreminders = [];
    const remindersRef = this.props.firebase.database().ref('reminders');
    remindersRef.once('value').then(snapshot => {
      snapshot.forEach((childSnapshot) => {
        DBreminders.push({
          id: childSnapshot.val().id,
          color: childSnapshot.val().color,
          when: childSnapshot.val().when,
          where: childSnapshot.val().where,
          description: childSnapshot.val().description
        })
      })
      this.setState({
        reminders: DBreminders
      })
    });
  }
  /**
   * Write data of a new reminder to the DB
   * @param {*} id unique id of the reminder
   * @param {*} color color selected for the reminder
   * @param {*} description description of the reminder
   * @param {*} when when will it occur
   * @param {*} where where will it occur
   */
  writeReminderData(id, color, description, when, where) {
    this.props.firebase.database().ref('reminders/' + id).set({
      color: color,
      description: description,
      when: when,
      where: where
    });
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          Calendar
        </header>
        <button onClick={this.togglePopup.bind(this)}>Add reminder</button>
        <div className="calendar-body">
          <Calendar reminders={this.state.reminders}/>
        </div>
        {this.state.showPopup ? 
          <Popup
            text='New reminder'
            closePopup={this.sendData.bind(this)}
          />
          : null
        }
      </div>
    );
  }
}

// Components NOT in use /////////////////////

// class Day extends Component {
//   render(){
//     const day = this.props.day;
//     const reminders = day.reminders.map(reminder => {
//       return(
//         <div className="reminder">
//           <Event event={reminder}/>
//         </div>
//       )
//     })
//     return(
//       <div>
//         <span>{day.day}</span>
//         <div>{reminders}</div>
//       </div>
//     )
//   }
// }

// class Event extends Component {
//   render(){
//     const event = this.props.event;
//     return(
//       <span>{event.description}</span>
//     )
//   }
// }

///////////////////////////////////////////////

export default App;
