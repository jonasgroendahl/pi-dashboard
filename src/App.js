import React, { Component, Fragment } from "react";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import PiList from "./components/PiList/PiList";
import axios from "axios";
import "./App.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import UploadDialog from "./components/UploadDialog/UploadDialog";
import BlockList from "./components/BlockList/BlockList";
import PiContentList from "./components/PiContentList/PiContentList";
import Calendar from "./components/Calendar/Calendar";

class App extends Component {
  state = {
    pis: [],
    blocks: [],
    uploading: false,
    picontent: [],
    view: 'block'
  };

  componentDidMount() {
    axios.get("https://api-wexer.herokuapp.com/v1/pi?gym_id=2415").then(res => {
      console.log(res);
      this.setState({ pis: res.data });
    });
    axios.get("https://api-wexer.herokuapp.com/v1/pi/blocks?gym_id=2415").then(res => {
      console.log("blocks", res);
      this.setState({ blocks: res.data });
    });
    axios.get("https://api-wexer.herokuapp.com/v1/pi/content?gym_id=2415").then(res => {
      console.log("content", res);
      this.setState({ picontent: res.data });
    });
  }

  toggleUploadDialog = () => {
    const { uploading } = this.state;
    this.setState({ uploading: !uploading });
  };

  addBlock = (block) => {
    const { blocks } = this.state;
    blocks.push(block);
    this.setState({ blocks });
  }

  render() {
    return (
      <div className="App">
        <div className="grid">
          <div className="left-menu-wrapper">
            <PiList items={this.state.pis} />
            <Card style={{ alignSelf: 'flex-start', backgroundColor: this.state.view == 'block' ? 'cornflowerblue' : '#f50057', color: this.state.view == 'block' ? 'black' : 'white', transition: 'all 0.5s ease-in' }}>
              <CardContent>
                {this.state.view == 'block' ?
                  <Fragment><h1>Build blocks!</h1><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate voluptate sequi suscipit aliquid assumenda, iure debitis totam ipsum quisquam? Sunt.</p></Fragment>
                  : <h1>Calendar</h1>
                }
              </CardContent>
            </Card>
            <Card raised>
              <CardContent>
                <h2>Upload your own videos</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Eaque iure velit quidem nesciunt rem, ullam porro recusandae
                  ut tenetur dolorem?
                </p>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.toggleUploadDialog}
                >
                  Begin upload wizard
                  <CloudUploadIcon style={{ marginLeft: "15px" }} />
                </Button>
              </CardContent>
            </Card>
            <Card raised className="middle-card">
              <CardContent>
                <h2>Manage your content</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Eaque iure velit quidem nesciunt rem, ullam porro recusandae
                  ut tenetur dolorem?
                </p>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => this.setState({ view: 'block' })}
                  style={{ margin: '5px' }}
                  disabled={this.state.view == 'block'}
                >
                  Build a new block
                </Button>
                <Button
                  variant="raised"
                  color={"primary"}
                  onClick={() => this.setState({ view: 'calendar' })}
                  style={{ margin: '5px' }}
                  disabled={this.state.view == 'calendar'}
                >
                  Schedule blocks
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h2>Your blocks</h2>
                <BlockList items={this.state.blocks} />
              </CardContent>
            </Card>
            <UploadDialog
              show={this.state.uploading}
              toggleUploadDialog={this.toggleUploadDialog}
              addBlock={this.addBlock}
            />
          </div>
          <div>
            {
              this.state.view == 'block' ? <PiContentList addBlock={this.addBlock} items={this.state.picontent} /> : <Calendar />
            }
          </div>
        </div>
      </div >
    );
  }
}

export default App;
