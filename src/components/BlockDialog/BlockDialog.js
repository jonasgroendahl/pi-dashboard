import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button } from '@material-ui/core';

export default class BlockDialog extends Component {

    handleOnClose = () => {
        console.log("handeOnClose");
        this.props.toggleBlockDialog();
    }

    render() {
        return (
            <Dialog open={this.props.show} onClose={this.handleOnClose}>
                <DialogTitle>Save your block</DialogTitle>
                <DialogContent>
                    <p>{`Your block consists of ${this.props.items.length} items`}</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit, a.</p>
                    <TextField label="Block name" fullWidth onChange={this.props.handleBlockNameChange} />
                    <Button variant="raised" color="primary" onClick={this.props.handleSaveBlock} style={{ marginTop: 5 }}>Save</Button>
                </DialogContent>
            </Dialog>
        );
    }
}