import React, { Component } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Select,
  MenuItem,
  DialogActions
} from "@material-ui/core";

export default class PiDialog extends Component {
  componentDidMount() {
    this.setState({
      calendar_id: this.props.pi.calendar_id,
      screensaver: this.props.pi.screensaver,
      name: this.props.pi.name
    });
  }

  state = {
    calendar_id: 0,
    screensaver: "",
    name: ""
  };

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  saveChanges = () => {
    const pi = {
      name: this.state.name,
      calendar_id: this.state.calendar_id,
      screensaver: this.state.screensaver
    };
    this.props.editPi(pi);
  };

  render() {
    return (
      <Dialog open={this.props.show} onClose={this.props.toggleEditPi}>
        <form autoComplete="off">
          <DialogTitle>Lorem ipsum dolor sit amet.</DialogTitle>
          <DialogContent>
            <div className="flex column">
              <TextField
                label="Name"
                name="name"
                value={this.state.name}
                onChange={this.onChange}
              />
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, recusandae.
              </p>
              <Select
                name="calendar_id"
                value={this.state.calendar_id}
                onChange={this.onChange}
              >
                {this.props.calendars.map(calendar => (
                  <MenuItem value={calendar.id}>{calendar.name}</MenuItem>
                ))}
              </Select>
            </div>
          </DialogContent>
          <DialogActions>
            <Button variant="raised" color="secondary">
              Upload Screensaver
            </Button>
            <Button variant="raised" color="primary" onClick={this.saveChanges}>
              Save changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}
