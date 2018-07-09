import React, { Component } from "react";
import "./PiContentList.css";
import {
  Card,
  TextField,
  CardContent,
  Avatar,
  IconButton,
  Tooltip
} from "@material-ui/core";
import Slider from "@material-ui/lab/Slider";
import IconArrowLeft from "@material-ui/icons/ArrowBack";
import IconArrowRight from "@material-ui/icons/ArrowForward";
import { Delete, ExpandMore, ExpandLess, Save } from "@material-ui/icons";
import BlockDialog from "../BlockDialog/BlockDialog";
import axios from "axios";

export default class PiContentList extends Component {
  state = {
    currentIndex: 0,
    block: [],
    showBlockDialog: false,
    searchValue: "",
    id: 0
  };

  componentDidMount() {
    if (this.props.block) {
      this.fetchContent();
    }
  }

  componentDidUpdate(prop) {
    console.log("Updating PiContentList");
    if (this.props.block && this.props.block != prop.block) {
      this.setState({ id: this.props.block.id });
      this.fetchContent();
    } else if (!this.props.block && prop.block) {
      this.setState({ block: [], id: 0 });
    }
  }

  fetchContent = () => {
    axios
      .get(
        `https://api-wexer.herokuapp.com/v1/pi/blocks/${this.props.block.id}`
      )
      .then(res => {
        const classes = [];
        res.data.length > 0 &&
          res.data.forEach(cl => {
            const index = classes.findIndex(c => c.content_id == cl.content_id);
            console.log(index);
            if (index === -1) {
              cl.amount = 0;
              classes.push(cl);
            } else {
              classes[index].amount += 1;
            }
          });
        const mappedData = classes.map(blockItem => ({
          file_name: blockItem.content_file_name,
          duration: parseInt(blockItem.duration),
          amount: blockItem.amount,
          type: blockItem.type
        }));
        this.setState({ block: mappedData });
      });
  };

  decreaseCurrentIndex = () => {
    const { currentIndex } = this.state;
    if (currentIndex !== 0) {
      this.setState({ currentIndex: currentIndex - 15 });
    }
  };

  increaseCurrentIndex = () => {
    const { currentIndex } = this.state;
    if (currentIndex < this.props.items.length - 15) {
      this.setState({ currentIndex: currentIndex + 15 });
    }
  };

  handleClick = item => {
    const { block } = this.state;
    item.amount = 1;
    block.push({ ...item });
    this.setState({ block });
  };

  handleSliderChange = (event, value, index) => {
    const { block } = this.state;
    block[index].amount = value;
    this.setState({ block });
  };

  handleBlockItemDelete = index => {
    const { block } = this.state;
    block.splice(index, 1);
    this.setState({ block });
  };

  handleMoveBlockItem = (index, direction) => {
    const { block } = this.state;
    if (direction === "up" && index !== 0) {
      const prev = block[index - 1];
      block[index - 1] = block[index];
      block[index] = prev;
    } else if (direction === "down" && index < block.length - 1) {
      const prev = block[index + 1];
      block[index + 1] = block[index];
      block[index] = prev;
    }
    this.setState({ block });
  };

  handleSaveBlock = blockName => {
    const { block } = this.state;
    const combinedDuration = block.reduce(
      (acc, blockItem) => (acc += blockItem.duration * blockItem.amount),
      0
    );
    this.props.addBlock({ name: blockName, duration: combinedDuration });
    block.splice(0, block.length);
    this.setState({ showBlockDialog: false, block });
  };

  toggleBlockDialog = () => {
    const { showBlockDialog } = this.state;
    console.log(this.state);
    if (this.state.id) {
      this.props.editBlock(this.state.block);
      alert("Saved changes to block");
    } else {
      this.setState({ showBlockDialog: !showBlockDialog });
    }
  };

  onSearch = event => {
    this.setState({ searchValue: event.target.value });
  };

  render() {
    const media = {
      height: "100px",
      width: "100px",
      margin: "0 2px",
      position: "relative"
    };

    let classes = this.props.items
      .filter(cl =>
        cl.name.toLowerCase().includes(this.state.searchValue.toLowerCase())
      )
      .map(
        (item, index) =>
          index < this.state.currentIndex + 15 &&
          index > this.state.currentIndex && (
            <div>
              <Tooltip title={item.name}>
                <Avatar
                  onClick={() => this.handleClick(item)}
                  style={media}
                  src={
                    item.type === 1
                      ? `https://nfoo-server.com/ConnectedFitnessLabs/${item.file_name.substr(
                          0,
                          item.file_name.length - 4
                        )}Square.jpg`
                      : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png"
                  }
                />
              </Tooltip>
            </div>
          )
      );

    return (
      <div className="pi-content-wrapper">
        <div className="pi-content-list">
          <div className="pi-content-nav">
            <IconButton onClick={this.decreaseCurrentIndex}>
              <IconArrowLeft
                style={{
                  width: 40,
                  height: 40,
                  color: this.state.currentIndex !== 0 ? "white" : "black"
                }}
              />
            </IconButton>
            <IconButton onClick={this.increaseCurrentIndex}>
              <IconArrowRight
                style={{
                  width: 40,
                  height: 40,
                  color:
                    this.state.currentIndex < this.props.items.length - 10
                      ? "white"
                      : "black"
                }}
              />
            </IconButton>
            <IconButton onClick={this.toggleBlockDialog}>
              <Save
                style={{
                  width: 40,
                  height: 40,
                  color: this.state.block.length > 0 ? "white" : "black"
                }}
              />
            </IconButton>
            <TextField onChange={this.onSearch} label="Search for videos" />
          </div>
          {classes}
        </div>
        <div className="block-grid">
          {this.state.block.map((item, index) => (
            <Card style={{ animation: "0.3s slideUp" }}>
              <CardContent>
                <div style={{ display: "flex" }}>
                  <Avatar
                    src={
                      item.type === 1
                        ? `https://nfoo-server.com/ConnectedFitnessLabs/${item.file_name.substr(
                            0,
                            item.file_name.length - 4
                          )}Square.jpg`
                        : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png"
                    }
                    style={{ width: 80, height: 80 }}
                  />
                  <h5>{item.file_name}</h5>
                  <h5>{`${item.duration *
                    item.amount} seconds - this class will repeat ${
                    item.amount
                  } time(s)`}</h5>
                </div>
                <Slider
                  value={item.amount}
                  min={1}
                  max={20}
                  step={1}
                  onChange={(e, val) => this.handleSliderChange(e, val, index)}
                />
                <div
                  style={{
                    float: "right",
                    marginBottom: 2
                  }}
                >
                  <IconButton onClick={() => this.handleBlockItemDelete(index)}>
                    <Delete />
                  </IconButton>

                  {index !== 0 && (
                    <IconButton
                      onClick={() => this.handleMoveBlockItem(index, "up")}
                    >
                      <ExpandLess />
                    </IconButton>
                  )}
                  {index < this.state.block.length - 1 && (
                    <IconButton
                      onClick={() => this.handleMoveBlockItem(index, "down")}
                    >
                      <ExpandMore />
                    </IconButton>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {
          <BlockDialog
            show={this.state.showBlockDialog}
            toggleBlockDialog={this.toggleBlockDialog}
            items={this.state.block}
            handleSaveBlock={this.handleSaveBlock}
          />
        }
      </div>
    );
  }
}
