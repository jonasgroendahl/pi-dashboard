import React, { Component } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button
} from "@material-ui/core";

export default class BlockDialog extends Component {
  state = {
    name: ""
  };

  handleOnClose = () => {
    console.log("handeOnClose");
    this.props.toggleBlockDialog();
  };

  onChange = event => {
    this.setState({ name: event.target.value });
  };

  render() {
    return (
      <Dialog open={this.props.show} onClose={this.handleOnClose}>
        <DialogTitle>Save your block</DialogTitle>
        <DialogContent>
          <p>{`Your block consists of ${this.props.items.length} items`}</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit, a.
          </p>
          <TextField
            label="Block name"
            fullWidth
            onChange={this.onChange}
            value={this.state.name}
          />
          <Button
            variant="raised"
            color="primary"
            disabled={this.state.name.length < 3}
            onClick={() => this.props.handleSaveBlock(this.state.name)}
            style={{ marginTop: 5 }}
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    );
  }
}
