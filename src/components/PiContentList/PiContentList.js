import React, { Component, Fragment } from 'react';
import './PiContentList.css';
import { Card, CardMedia, TextField, CardContent, Avatar, IconButton, Tooltip } from '@material-ui/core';
import Slider from "@material-ui/lab/Slider";
import IconArrowLeft from "@material-ui/icons/ArrowBack";
import IconArrowRight from "@material-ui/icons/ArrowForward";
import { Delete, ExpandMore, ExpandLess, Save } from "@material-ui/icons";
import BlockDialog from '../BlockDialog/BlockDialog';


export default class PiContentList extends Component {
    state = {
        currentIndex: 0,
        block: [],
        showBlockDialog: false,
        name: '',
        duration: 0
    }

    decreaseCurrentIndex = () => {
        const { currentIndex } = this.state;
        if (currentIndex !== 0) {
            this.setState({ currentIndex: currentIndex - 10 });
        }
    }

    increaseCurrentIndex = () => {
        const { currentIndex } = this.state;
        if (currentIndex < this.props.items.length - 10) {
            this.setState({ currentIndex: currentIndex + 10 });
        }
    }

    handleClick = (item) => {
        const { block } = this.state;
        item.amount = 1;
        block.push({ ...item });
        this.setState({ block });
    }

    handleSliderChange = (event, value, index) => {
        const { block } = this.state;
        block[index].amount = value;
        this.setState({ block });
    }

    handleBlockItemDelete = (index) => {
        const { block } = this.state;
        block.splice(index, 1);
        this.setState({ block });
    }

    handleMoveBlockItem = (index, direction) => {
        const { block } = this.state;
        if (direction == 'up' && index !== 0) {
            const prev = block[index - 1];
            block[index - 1] = block[index];
            block[index] = prev;
        }
        else if (direction == 'down' && index < block.length - 1) {
            const prev = block[index + 1];
            block[index + 1] = block[index];
            block[index] = prev;
        }
        this.setState({ block });
    }

    handleBlockNameChange = (event) => {
        this.setState({ name: event.target.value });
    }

    handleSaveBlock = () => {
        const { block, name } = this.state;
        this.props.addBlock({ name });
        block.splice(0, block.length);
        this.setState({ showBlockDialog: false, block });
    }

    toggleBlockDialog = () => {
        const { showBlockDialog } = this.state;
        this.setState({ showBlockDialog: !showBlockDialog });
    }

    render() {
        const media = {
            height: '100px',
            width: '100px',
            margin: '0 2px',
            position: 'relative'
        }

        return (
            <div className="pi-content-wrapper">
                <div className="pi-content-list">
                    <div className="pi-content-nav">
                        <IconButton onClick={this.decreaseCurrentIndex} >
                            <IconArrowLeft style={{ width: 40, height: 40, color: 'white' }} />
                        </IconButton>
                        <IconButton onClick={this.increaseCurrentIndex} >
                            <IconArrowRight style={{ width: 40, height: 40, color: 'white' }} />
                        </IconButton>
                        <IconButton onClick={this.toggleBlockDialog}>
                            <Save style={{ width: 40, height: 40, color: 'white' }} />
                        </IconButton>
                    </div>
                    {this.props.items.map((item, index) =>
                        (index > this.state.currentIndex && index < this.state.currentIndex + 15) && <div>
                            <Tooltip title={item.name}><Avatar onClick={() => this.handleClick(item)} style={media} src={item.type == 1 ? `https://nfoo-server.com/ConnectedFitnessLabs/${item.file_name.substr(0, item.file_name.length - 4)}Square.jpg` : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png'}>

                            </Avatar>
                            </Tooltip>
                        </div>
                    )}
                </div>
                <div className="block-grid">
                    {this.state.block.map((item, index) =>
                        <Card>
                            <CardContent>
                                <div style={{ display: 'flex' }}>
                                    <Avatar src={item.type == 1 ? `https://nfoo-server.com/ConnectedFitnessLabs/${item.file_name.substr(0, item.file_name.length - 4)}Square.jpg` : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png'} style={{ width: 80, height: 80 }} />
                                    <h5>{item.file_name}</h5>
                                    <h5>{`${item.duration * item.amount} seconds - this class will repeat ${item.amount} time(s)`}</h5>
                                </div>
                                <Slider value={item.amount} min={1} max={20} step={1} onChange={(e, val) => this.handleSliderChange(e, val, index)} />
                                <div style={{
                                    float: 'right',
                                    marginBottom: 2
                                }}>

                                    <IconButton onClick={() => this.handleBlockItemDelete(index)}>
                                        <Delete />
                                    </IconButton>

                                    {index !== 0 &&
                                        <IconButton onClick={() => this.handleMoveBlockItem(index, "up")}>
                                            <ExpandLess />
                                        </IconButton>
                                    }
                                    {index < this.state.block.length - 1 &&
                                        <IconButton onClick={() => this.handleMoveBlockItem(index, "down")}>
                                            <ExpandMore />
                                        </IconButton>
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
                {<BlockDialog show={this.state.showBlockDialog} toggleBlockDialog={this.toggleBlockDialog} items={this.state.block} handleSaveBlock={this.handleSaveBlock} handleBlockNameChange={this.handleBlockNameChange} />}
            </div>
        );
    }
}