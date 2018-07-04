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

export default class PiList extends Component {
  render() {
    return (
      <ExpansionPanel style={{ width: '100%' }}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <ListItem>
            <Avatar>
              <ImageIcon />
            </Avatar>
            <ListItemText primary="Wexer Mini Systems" />
          </ListItem>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List>
            {this.props.items.map(i => (
              <ListItem>
                <Avatar>
                  <ImageIcon />
                </Avatar>
                <ListItemText primary={i.name} secondary="Jan 9, 2014" />
                <ListItemText>
                  <h4
                    style={{
                      color: "#CCFF90",
                      fontFamily: "Montserrat"
                    }}
                  >
                    Running
                  </h4>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}
