import React, { Component } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Paper,
  MenuItem,
  Chip,
  DialogActions,
  withStyles
} from "@material-ui/core";
import Downshift from "../../../node_modules/downshift";

const styles = {
  paper: {
    minWidth: 300
  }
};

class BlockDialog extends Component {
  state = {
    name: "",
    autocomplete: [
      { value: "HIIT" },
      { value: "Core" },
      { value: "Warm Up" },
      { value: "Cooldown" }
    ],
    search: "",
    keywords: [],
    id: 0
  };

  componentDidUpdate(props) {
    if (this.props.id && props.id != this.props.id) {
      let keywords = [];
      if (this.props.keywords) {
        keywords = this.props.keywords
          .split(",")
          .map(key => ({ value: key.trim() }));
      }
      this.setState({ name: this.props.name, keywords });
    }
  }

  handleOnClose = () => {
    console.log("handeOnClose");
    this.props.toggleBlockDialog();
  };

  onChange = event => {
    this.setState({ name: event.target.value });
  };

  autocompleteHandler = selection => {
    const { keywords } = this.state;
    keywords.push(selection);
    this.setState({ keywords, search: "" });
  };

  removeKeyword = index => {
    const { keywords } = this.state;
    keywords.splice(index, 1);
    this.setState({ keywords });
  };

  searchHandler = event => {
    this.setState({ search: event.target.value });
  };

  render() {
    const { autocomplete, keywords } = this.state;

    const { classes } = this.props;

    return (
      <Dialog
        open={this.props.show}
        onClose={this.handleOnClose}
        classes={{
          paper: classes.paper
        }}
      >
        <DialogTitle>
          {this.props.id ? "Edit your block" : "Save your block"}
        </DialogTitle>
        <DialogContent>
          <p>{`Your block consists of ${this.props.items.length} items`}</p>
          <TextField
            label="Block name"
            fullWidth
            onChange={this.onChange}
            value={this.state.name}
          />
          <Downshift
            onChange={this.autocompleteHandler}
            itemToString={item => (item ? item.value : "")}
          >
            {({ getInputProps, getItemProps, isOpen }) => (
              <div>
                <TextField
                  fullWidth
                  InputProps={getInputProps({
                    onChange: this.searchHandler,
                    onKeyDown: event =>
                      event.keyCode == 13
                        ? this.autocompleteHandler({ value: this.state.search })
                        : null,
                    value: this.state.search,
                    startAdornment: keywords.map((item, index) => (
                      <Chip
                        key={item.value}
                        tabIndex={-1}
                        label={item.value}
                        style={{ margin: 2 }}
                        onClick={() => this.removeKeyword(index)}
                      />
                    ))
                  })}
                  label="Keywords"
                  style={{ marginTop: 5 }}
                />
                {isOpen ? (
                  <Paper>
                    {autocomplete
                      .filter(item =>
                        item.value
                          .toLowerCase()
                          .includes(this.state.search.toLowerCase())
                      )
                      .map(item => (
                        <MenuItem
                          {...getItemProps({ item })}
                          value={item.value}
                        >
                          {item.value}
                        </MenuItem>
                      ))}
                  </Paper>
                ) : null}
              </div>
            )}
          </Downshift>
        </DialogContent>
        <DialogActions>
          <Button
            variant="raised"
            color="primary"
            disabled={this.state.name.length < 3}
            onClick={() =>
              this.props.handleSaveBlock(this.state.name, this.state.keywords)
            }
            style={{ marginTop: 5 }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(BlockDialog);
