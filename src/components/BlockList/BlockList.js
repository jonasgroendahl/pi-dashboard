import dragula from "fullcalendar/dist/dragula.min.js";
import React, { Component } from "react";
import {
  List,
  ListItem,
  Avatar,
  ListItemText,
  ListItemSecondaryAction
} from "@material-ui/core";
import ViewIcon from "@material-ui/icons/ViewDay";
import moment from 'moment';

export default class BlockList extends Component {


  componentDidMount() {

  }

  componentDidUpdate(props) {
    const div = document.querySelectorAll(".test");
    console.log("Making stuff draggable", div);

    const mappedDiv = Array.prototype.slice.call(div);
    dragula(mappedDiv, {
      copy: true,
      accepts: function (el, target) {
        target == document.querySelector("#calendar")
      }
    });


  }

  render() {
    return (
      <List className="draggable-events">
        {this.props.items.map((item, index) => (
          <ListItem
            key={`${index}_block`}
            dense
            button
            onClick={() => this.props.setSelectedBlock(item)}
            style={{
              backgroundColor:
                this.props.selectedBlock === item ? "#eee" : "initial"
            }}
          >
            <div className="test">
              <Avatar data-event={`${JSON.stringify({ duration: moment(0).hours(0).add(item.duration, 'seconds').format('HH:mm:ss'), title: item.name, block_id: item.id })}`}>
                <ViewIcon />
              </Avatar>
            </div>
            <ListItemText primary={item.name} />
            <ListItemSecondaryAction>

            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  }
}
