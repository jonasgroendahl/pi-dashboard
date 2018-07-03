import React, { Component, Fragment } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";

import AddIcon from "@material-ui/icons/Add";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";

import "./UploadDialog.css";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      autoCloseTimer: 5
    };
    this.uploadRef = React.createRef();
    this.autoCloseTimerInterval = null;
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

  onUploadHandler = () => {
    this.setState({ activeStep: 1 });
    setTimeout(() => {
      this.setState({ activeStep: 2 });
      this.autoCloseTimerInterval = setInterval(() => {
        const { autoCloseTimer } = this.state;
        if (autoCloseTimer == 0) {
          this.onUploadDialogClose();
        } else {
          this.setState({ autoCloseTimer: autoCloseTimer - 1 });
        }
      }, 1000);
    }, 5000);
  };

  onUploadDialogClose = () => {
    clearInterval(this.autoCloseTimerInterval);
    this.setState({ activeStep: 0, autoCloseTimer: 5 });
    this.props.toggleUploadDialog();
  };

  getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <Fragment>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Assumenda, corrupti.
            </p>
            <IconButton color="primary" onClick={this.startUpload}>
              <AddIcon />
            </IconButton>
            <IconButton color="primary" onClick={this.onUploadDialogClose}>
              <CloseIcon />
            </IconButton>
          </Fragment>
        );
      case 1:
        return <CircularProgress color="primary" thickness={7} />;
      case 2:
        return (
          <Fragment>
            <DoneIcon style={{ color: "green", width: 55, height: 55 }} />
            <Button
              color="primary"
              onClick={this.onUploadDialogClose}
            >{`Close (Auto close in ${this.state.autoCloseTimer})`}</Button>
          </Fragment>
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
        <DialogTitle id="responsive-dialog-title">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit,
          minima.
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
          <div className="stepper-content-div">
            {this.getStepContent(this.state.activeStep)}
          </div>
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
