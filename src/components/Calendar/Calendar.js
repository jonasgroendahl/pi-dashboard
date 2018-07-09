import React, { Component } from "react";
import "./Calendar.css";
import "fullcalendar";
import "fullcalendar/dist/fullcalendar.min.css";
import $ from "jquery";

export default class extends Component {
  componentDidMount() {
    this.createCalendar();
  }

  componentDidUpdate(props) {
    if (this.props.selectedCalendar != props.selectedCalendar) {
      this.createCalendar();
    }
  }

  createCalendar = () => {
    $("#calendar").fullCalendar("destroy");
    $("#calendar").fullCalendar({
      defaultView: "agendaWeek",
      allDaySlot: false,
      height: "parent",
      editable: true,
      eventDurationEditable: false,
      slotDuration: "00:05:00",
      slotLabelInterval: "00:15:00",
      firstDay: 1,
      eventOverlap: false,
      selectOverlap: false,
      columnFormat: "dddd",
      events: [
        {
          start: "2018-07-04 14:00:00",
          end: "2018-07-04 15:00:00",
          title: "Test"
        }
      ],
      dayClick: (date, jsEvent, view) => {
        if (
          this.props.selectedBlock &&
          $("#calendar").fullCalendar("clientEvents", event =>
            this.filterEvents(event, date)
          ).length == 0
        ) {
          $("#calendar").fullCalendar("renderEvent", {
            start: date,
            end: date.clone().add(this.props.selectedBlock.duration, "s"),
            title: this.props.selectedBlock.name
          });
        } else {
          alert(
            "You must select a block first! And remember no overlaps allowed."
          );
        }
      }
    });
  };

  filterEvents = (event, start) => {
    if (
      event.start.format("YYYY-MM-DD HH:mm:ss") ==
      start.format("YYYY-MM-DD HH:mm:ss")
    ) {
      return event;
    }
  };

  render() {
    return <div id="calendar" />;
  }
}
