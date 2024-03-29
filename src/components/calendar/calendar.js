import { Component } from 'react';
import * as dateFns from 'date-fns';
import './calendar.css'

class Calendar extends Component {
    render(){
        return(
          <div>
            <Month reminders={this.props.reminders} openReminder={(r) => this.props.openReminder(r)}/>
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
    previousMonth(){
        const previousMonth = dateFns.subDays(dateFns.startOfMonth(this.state.currentMonth), 1);
        this.setState({
            currentMonth: previousMonth
        })
    }
    nextMonth(){
        const nextMonth = dateFns.addDays(dateFns.endOfMonth(this.state.currentMonth), 1);
        this.setState({
            currentMonth: nextMonth,
        })
    }
    /**
     * Renders the header of the page
     */
    renderHeader(){
        // this.nextMonth();
        return (
            <div className="month-header">
                <button onClick={() => this.previousMonth()}>Previous month</button>
                <h1 className="monthName">{dateFns.format(this.state.currentMonth, 'MMMM yyyy')}</h1>
                <button onClick={this.nextMonth.bind(this)}>Next month</button>
            </div>
        )
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
                    // onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
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
    /**
     * Get and render the reminders for a given day
     * @param {*} day 
     */
    getDayReminders(day){
        let reminders = [];
        for(let r of this.props.reminders) {
        let reminderDate = new Date(r.when).getDate() + "/" + new Date(r.when).getMonth();
        if(reminderDate === (day.getDate() + "/" + day.getMonth())){
            reminders.push(
                <div key ={r.id} className="reminder" onClick={() => this.props.openReminder(r)}>
                    <div className="reminder-color" style={
                        {
                            backgroundColor:r.color,
                        }
                    } ></div>
                    <div className="reminder-description">{r.description}</div><br/>
                </div>
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

    export default Calendar;