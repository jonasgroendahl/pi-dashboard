import React, { Component } from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import { Build } from "@material-ui/icons";
import { ListItemSecondaryAction, IconButton } from "@material-ui/core";

export default class PiList extends Component {
  render() {
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <ListItem>
            <Avatar>
              <ImageIcon />
            </Avatar>
            <ListItemText primary="Wexer Circuit systems" />
          </ListItem>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List style={{ width: "100%" }}>
            {this.props.items.map((i, index) => (
              <ListItem key={index}>
                <Avatar>
                  <ImageIcon />
                </Avatar>
                <ListItemText primary={i.name} secondary="Running" />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => this.props.toggleEditPi(index)}>
                    <Build />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}
