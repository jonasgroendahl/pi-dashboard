import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "../../axios";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";

import "./UploadDialog.css";
import { Checkbox, FormControlLabel, Zoom, TextField } from "@material-ui/core";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      autoCloseTimer: 5,
      isSavedAsBlock: true,
      block: {
        name: "",
        src: "",
        duration: 0,
        gym_id: 0,
        id: 0
      }
    };
    this.uploadRef = React.createRef();
  }

  componentDidMount() {
    console.log(this.props);
  }

  getSteps() {
    return ["Choose video file", "Upload", "Finished"];
  }

  startUpload = () => {
    this.uploadRef.current.click();
  };

  onUploadHandler = event => {
    const { block } = this.state;
    const file = event.target.files[0];
    const video = document.createElement("video");
    if (file.type.includes("video")) {
      this.setState({ activeStep: 1 });
      video.onloadedmetadata = async () => {
        console.log("duration", video.duration);
        block.duration = Math.ceil(video.duration);
        block.gym_id = this.state.gym_id;
        const payload = new FormData();
        payload.append("video", file);
        payload.append("name", block.name);
        payload.append("duration", block.duration);
        payload.append("gym", this.state.gym_id);
        const result = await axios.post("/v1/uploads/upload_pi", payload);
        block.id = result.data.id;
        console.log("new content got ID:", result.data.id);
        this.setState({ block: block, activeStep: 2 });
      };
      video.src = URL.createObjectURL(file);
    } else {
      alert("Wrong file format, upload a video please!");
    }
  };

  onUploadDialogClose = () => {
    clearInterval(this.autoCloseTimerInterval);
    this.props.toggleUploadDialog();
    if (this.state.isSavedAsBlock) {
      console.log("save as a block");
      this.props.addContent(this.state.block, "save");
    } else {
      this.props.addContent(this.state.block);
    }
    this.setState({ activeStep: 0, autoCloseTimer: 5, isSavedAsBlock: false });
  };

  handleCheckboxChange = () => {
    const { isSavedAsBlock } = this.state;
    this.setState({ isSavedAsBlock: !isSavedAsBlock });
  };

  onChange = event => {
    const { block } = this.state;
    block.name = event.target.value;
    this.setState({ block });
  };

  getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <div className="stepper-content-div column">
            <p>Assign a name to your video and press 'Upload'.</p>
            <TextField
              value={this.state.block.name}
              onChange={this.onChange}
              label="Name of file"
              style={{ marginBottom: "20px" }}
            />
            <Button
              variant="raised"
              color="primary"
              onClick={this.startUpload}
              disabled={this.state.block.name.length < 3}
            >
              Upload
            </Button>
          </div>
        );
      case 1:
        return (
          <div className="stepper-content-div">
            <CircularProgress color="primary" thickness={7} />
          </div>
        );
      case 2:
        return (
          <div
            className="stepper-content-div column"
            style={{ alignItems: "center" }}
          >
            <div>
              <Zoom in={true} timeout={2000}>
                <DoneIcon style={{ color: "green", width: 100, height: 100 }} />
              </Zoom>
            </div>
            <div>
              <Button color="primary" onClick={this.onUploadDialogClose}>
                Close
              </Button>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={this.handleCheckboxChange}
                    checked={this.state.isSavedAsBlock}
                  />
                }
                label="Save as a block?"
              />
            </div>
          </div>
        );
      default:
        return (
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Recusandae, dolore?
          </p>
        );
    }
  };

  render() {
    const steps = this.getSteps();
    return (
      <Dialog
        open={this.props.show}
        onClose={this.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        {this.state.activeStep == 0 && (
          <IconButton
            color="primary"
            onClick={this.props.toggleUploadDialog}
            style={{ alignSelf: "flex-end" }}
          >
            <CloseIcon />
          </IconButton>
        )}
        <DialogTitle
          id="responsive-dialog-title"
          style={{ paddingTop: this.state.activeStep == 0 ? 0 : "24px" }}
        >
          Start uploading your own files
        </DialogTitle>
        <DialogContent>
          <Stepper nonLinear activeStep={this.state.activeStep}>
            {steps.map(label => {
              return (
                <Step key={label}>
                  <StepButton>{label}</StepButton>
                </Step>
              );
            })}
          </Stepper>
          <div>{this.getStepContent(this.state.activeStep)}</div>
        </DialogContent>
        <input
          type="file"
          ref={this.uploadRef}
          style={{ display: "none" }}
          onInput={this.onUploadHandler}
        />
      </Dialog>
    );
  }
}
