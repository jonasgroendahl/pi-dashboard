import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import PiList from "./components/PiList/PiList";
import axios from "axios";
import "./App.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import UploadDialog from "./components/UploadDialog/UploadDialog";

class App extends Component {
  state = {
    pis: [],
    uploading: false
  };

  componentDidMount() {
    axios.get("https://api-wexer.herokuapp.com/v1/pi?gym_id=2415").then(res => {
      console.log(res);
      this.setState({ pis: res.data });
    });
  }

  toggleUploadDialog = () => {
    const { uploading } = this.state;
    this.setState({ uploading: !uploading });
  };

  render() {
    return (
      <div className="App">
        <div className="grid">
          <div>
            <PiList items={this.state.pis} />
            <Card>
              <CardContent>
                <h2>Upload your own videos</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Eaque iure velit quidem nesciunt rem, ullam porro recusandae
                  ut tenetur dolorem?
                </p>
                <Button
                  variant="contained"
                  color="default"
                  onClick={this.toggleUploadDialog}
                >
                  Upload
                  <CloudUploadIcon style={{ marginLeft: "15px" }} />
                </Button>
              </CardContent>
            </Card>

            <UploadDialog
              show={this.state.uploading}
              toggleUploadDialog={this.toggleUploadDialog}
            />
          </div>
          <div>
            <h2>s</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
