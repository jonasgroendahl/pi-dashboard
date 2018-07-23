import React, { Component } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button
} from "@material-ui/core";

export default class CalendarDialog extends Component {
  state = {
    name: ""
  };

  onChange = event => {
    this.setState({ name: event.target.value });
  };

  render() {
    return (
      <Dialog open={this.props.show} onClose={this.props.toggleCalendarDialog}>
        <DialogTitle>Create a new planner.</DialogTitle>
        <DialogContent>
          <TextField label="Name" onChange={this.onChange} />
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="raised"
            onClick={() => this.props.addCalendar(this.state.name)}
          >
            Add planner
          </Button>
          <Button
            color="primary"
            variant="raised"
            onClick={this.props.toggleCalendarDialog}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
