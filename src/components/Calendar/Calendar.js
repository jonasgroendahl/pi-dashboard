import React, { Component } from "react";
import "./Calendar.css";
import { Calendar } from "fullcalendar";
import "fullcalendar/dist/fullcalendar.min.css";
import axios from "../../axios";

export default class extends Component {

  state = {
    parent_id: 0
  }

  componentDidMount() {
    this.calendar = null;
    this.createCalendar();
  }

  componentDidUpdate(props) {
    if (this.props.selectedCalendar != props.selectedCalendar) {
      this.calendar.refetchEvents();
    }
  }

  createCalendar = () => {
    console.log("Creating a calendar with ID", this.props.selectedCalendar);
    const options = {
      defaultView: "agendaWeek",
      allDaySlot: false,
      height: "parent",
      editable: true,
      minTime: '08:00:00',
      maxTime: '24:00:00',
      eventDurationEditable: false,
      slotDuration: "00:05:00",
      snapDuration: "00:01:00",
      firstDay: 1,
      eventOverlap: false,
      droppable: true,
      columnFormat: "dddd",
      events: (event, end, _, cb) => this.fetchData(event, end, _, cb),
      eventReceive: (event, element) => this.eventReceive(event, element),
      eventDrop: (event, delta) => this.eventDrop(event, delta),
      eventClick: (event) => this.eventClick(event)
    };
    const div = document.querySelector("#calendar");
    this.calendar = new Calendar(div, options);
    this.calendar.render();
  };

  fetchData = async (start, end, _, callback) => {
    const res = await axios.get(`/v1/pi/calendars/data?calendar_id=${this.props.selectedCalendar}`);
    let parent_id = 0;
    res.data.forEach(event => {
      if (event.parent_id > parent_id) {
        parent_id = event.parent_id;
      }
    });
    this.setState({ parent_id });
    callback(res.data);
  }

  eventClick = (event) => {
    axios
      .delete(`/v1/pi/calendardata?parent_id=${event.parent_id}&calendar_id=${this.props.selectedCalendar}`);
    this.calendar.removeEvents(event._id);
  }

  eventDrop = (event, delta) => {
    console.log("delta", delta);
    axios.put(`/v1/pi/calendars/data?parent_id=${
      event.parent_id
      }&calendar_id=${this.props.selectedCalendar}`, { delta: delta.asMilliseconds() });
  }

  eventReceive = (event) => {
    console.log(event);
    const start = event.start.clone();
    const end = event.end.clone();
    const events = [];
    for (let i = 0; i < 52; i++) {
      const newEvent = [
        this.formatDate(start),
        this.formatDate(end),
        this.state.parent_id + 1,
        event.block_id,
        this.props.selectedCalendar,
      ]
      events.push(newEvent);
      end.add(7, "days");
      start.add(7, "days");
    }
    event.parent_id = this.state.parent_id + 1;
    console.log("eventReceive", events);
    axios.post(`/v1/pi/calendars/data`, events);
    this.calendar.updateEvent(event);
    this.setState({ parent_id: this.state.parent_id + 1 });
  }

  formatDate = (date) => {
    return date.format('YYYY-MM-DD HH:mm:ss')
  }

  render() {
    return <div id="calendar" />;
  }
}
