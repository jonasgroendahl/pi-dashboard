import React, { Component } from "react";
import {
  List,
  ListItem,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core";
import ViewIcon from "@material-ui/icons/ViewDay";
import EditIcon from "@material-ui/icons/Build";

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
                this.props.selectedBlock === item ? "#eee" : "initial"
            }}
          >
            <Avatar>
              <ViewIcon />
            </Avatar>
            <ListItemText primary={item.name} />
            <ListItemSecondaryAction>
              <IconButton onClick={() => this.props.editSelectedBlock(index)}>
                <EditIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    );
  }
}
