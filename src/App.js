import './App.css';
import { Component } from 'react';
import * as dateFns from 'date-fns';

class App extends Component {
  constructor(){
    super();
    this.state = {
      showPopup: false,
      reminders: []
    }
  }

  componentDidMount(){
    this.getData()
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
  sendData(formResult){
    const newReminderKey = this.props.firebase.database().ref().child('reminders').push().key;
    this.writeReminderData(newReminderKey,formResult.color,formResult.description, formResult.when, formResult.where)
    this.setState({
      showPopup: !this.state.showPopup
    });
  }
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

class Calendar extends Component {
  render(){
      return(
        <div>
          <Month reminders={this.props.reminders}/>
        </div>
      )
  }
}

class Month extends Component{
  constructor(props){
    super(props);
    this.state = {
      currentMonth: new Date(),
      selectedDate: new Date()
    };
  }
  renderHeader(){
    return <h1 className="monthName">{dateFns.format(this.state.currentMonth, 'MMMM yyyy')}</h1>
  }
  /**
   * Renders days (name) of the current week
   */
  renderDays(){
    const dateFormat = "iiii";
    const days = [];
    let startDate = dateFns.startOfWeek(this.state.currentMonth, {weekStartsOn: 1});
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center day-name" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  }
  /**
   * Renders each cell of the month
   */
  renderCells(){
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        let reminders = this.getDayReminders(day);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell day${
              !dateFns.isSameMonth(day, monthStart)
                ? "-disabled"
                : dateFns.isSameDay(day, selectedDate) ? "-selected" : ""
            }`}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
          >
            <span className="number">{formattedDate}</span>
            <div>{reminders}</div>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="month-body">{rows}</div>;
  }
  getDayReminders(day){
    let reminders = [];
    for(let r of this.props.reminders) {
      let reminderDate = new Date(r.when).getDate();
      if(reminderDate === day.getDate()){
        reminders.push(
          <span className="reminder">{r.description}<br/></span>
        );
      }
    }
    return reminders;
  }
  render(){
    return(
      <div className="month">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
    )
  }
}

// Components NOT in use /////////////////////

class Day extends Component {
  render(){
    const day = this.props.day;
    const reminders = day.reminders.map(reminder => {
      return(
        <div className="reminder">
          <Event event={reminder}/>
        </div>
      )
    })
    return(
      <div>
        <span>{day.day}</span>
        <div>{reminders}</div>
      </div>
    )
  }
}

class Event extends Component {
  render(){
    const event = this.props.event;
    return(
      <span>{event.description}</span>
    )
  }
}

///////////////////////////////////////////////

class Popup extends Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h2>{this.props.text}</h2>
          <PopUpForm closePopup={this.props.closePopup}/>
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
    console.log(this.state.when)
  }
  handleInputChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
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
          className="input" 
          type="text"/>
        <input type="submit" value="New reminder"/>
      </form>
    )
   }
}

export default App;
