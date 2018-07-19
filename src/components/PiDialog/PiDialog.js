import React, { Component } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Select,
  MenuItem,
  DialogActions,
  Grow,
  Grid,
  FormControl,
  InputLabel
} from "@material-ui/core";
import { Event } from "@material-ui/icons";

export default class PiDialog extends Component {

  state = {
    calendar_id: 0,
    screensaver: "",
    name: "",
    loading: false,
    screensaverFileRef: null,
    id: 0
  };

  fileRef = React.createRef();

  componentDidMount() {
    this.setState({
      calendar_id: this.props.pi.calendar_id,
      screensaver: this.props.pi.screensaver,
      name: this.props.pi.name,
      id: this.props.pi.id
    });
  }

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onStartUpload = () => {
    this.fileRef.current.click();
  };

  onUpload = event => {
    this.loading = true;
    const file = event.target.files[0];
    if (file && file.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.setState({ screensaver: fileReader.result, screensaverFileRef: file });
      });
      fileReader.readAsDataURL(file);
    } else {
      alert("Please pick an image of either type .jpg or .png");
    }
  };

  saveChanges = () => {
    const pi = {
      name: this.state.name,
      calendar_id: this.state.calendar_id,
      id: this.state.id
    };
    if (this.state.screensaverFileRef) {
      pi.screensaver = this.state.screensaverFileRef;
    }
    console.log("saving changes for", pi);
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
              <Grid container spacing={8} alignItems="flex-end" style={{ marginTop: 5 }}>
                <Grid item>
                  <Event />
                </Grid>
                <Grid item style={{ flex: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="select-calendar">Select planner</InputLabel>
                    <Select
                      name="calendar_id"
                      value={this.state.calendar_id}
                      onChange={this.onChange}
                      id="select-calendar"
                    >
                      {this.props.calendars.map(calendar => (
                        <MenuItem value={calendar.id}>{calendar.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grow
                in={this.state.screensaver ? true : false}
                mountOnEnter
                unmountOnExit
              >
                <div className="flex" style={{ justifyContent: 'center' }}>
                  <img src={this.state.screensaver} alt="" height="200" />
                </div>
              </Grow>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              variant="raised"
              color="secondary"
              onClick={this.onStartUpload}
            >
              Upload Screensaver
            </Button>
            <Button variant="raised" color="primary" onClick={this.saveChanges}>
              Save changes
            </Button>
            <input
              type="file"
              ref={this.fileRef}
              style={{ display: "none" }}
              onChange={this.onUpload}
            />
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}
