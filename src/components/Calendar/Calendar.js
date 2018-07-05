import React, { Component } from "react";
import "./Calendar.css";
import "fullcalendar";
import "fullcalendar/dist/fullcalendar.min.css";
import $ from "jquery";

export default class extends Component {
  componentDidMount() {
    console.log("Mounted this piece of crap");
    $("#calendar").fullCalendar({
      defaultView: "agendaWeek",
      allDaySlot: false,
      events: [
        {
          start: "2018-07-04 14:00:00",
          end: "2018-07-04 15:00:00",
          title: "Test"
        }
      ],
      dayClick: (date, jsEvent, view) => {
        $("#calendar").fullCalendar("renderEvent", {
          start: date,
          end: date.clone().add(2, "h"),
          title: "Test"
        });
      }
    });
  }

  render() {
    return <div id="calendar" />;
  }
}
