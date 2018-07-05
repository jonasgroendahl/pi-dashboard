import React, { Component } from "react";
import {
  List,
  ListItem,
  Avatar,
  ListItemText,
  ListItemSecondaryAction
} from "@material-ui/core";
import ViewIcon from "@material-ui/icons/ViewDay";

export default class BlockList extends Component {
  render() {
    return (
      <List>
        {this.props.items.map((item, index) => (
          <ListItem
            key={`${index}_block`}
            dense
            button
            onClick={() => this.props.setSelectedBlock(item)}
            style={{
              backgroundColor:
                this.props.selectedBlock == item ? "#eee" : "initial"
            }}
          >
            <Avatar>
              <ViewIcon />
            </Avatar>
            <ListItemText primary={item.name} />
            <ListItemSecondaryAction />
          </ListItem>
        ))}
      </List>
    );
  }
}
