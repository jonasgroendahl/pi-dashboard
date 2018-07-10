import React, { Component, Fragment } from "react";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Event, Share, Add } from "@material-ui/icons";
import PiList from "./components/PiList/PiList";
import axios from "axios";
import "./App.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import UploadDialog from "./components/UploadDialog/UploadDialog";
import BlockList from "./components/BlockList/BlockList";
import PiContentList from "./components/PiContentList/PiContentList";
import Calendar from "./components/Calendar/Calendar";
import PiDialog from "./components/PiDialog/PiDialog";
import CalendarDialog from "./components/CalendarDialog/CalendarDialog";
import { Select, MenuItem } from "@material-ui/core";

class App extends Component {
  state = {
    pis: [],
    selectedPi: null,
    blocks: [],
    selectedBlock: null,
    selectedBlockEdit: null,
    isUploading: false,
    isEditingPi: false,
    isCalendarDialogShowing: false,
    picontent: [],
    view: "block",
    calendars: []
  };

  componentDidMount() {
    axios.get("https://api-wexer.herokuapp.com/v1/pi?gym_id=2415").then(res => {
      console.log(res);
      this.setState({ pis: res.data });
    });
    axios
      .get("https://api-wexer.herokuapp.com/v1/pi/blocks?gym_id=2415")
      .then(res => {
        console.log("blocks", res);
        this.setState({ blocks: res.data });
      });
    axios
      .get("https://api-wexer.herokuapp.com/v1/pi/content?gym_id=2415")
      .then(res => {
        console.log("content", res);
        this.setState({ picontent: res.data });
      });
    axios
      .get("https://api-wexer.herokuapp.com/v1/pi/calendars?gym_id=2415")
      .then(res => {
        if (res.data.length > 0) {
          res = res.data.map(calendar => ({
            name: calendar.name,
            id: calendar.id
          }));
          this.setState({ calendars: res, selectedCalendar: res[0].id });
        }
      });
  }

  toggleUploadDialog = () => {
    const { isUploading } = this.state;
    this.setState({ isUploading: !isUploading });
  };

  addBlock = block => {
    const { blocks } = this.state;
    blocks.push(block);
    this.setState({ blocks });
  };

  editBlock = block => {
    const { blocks } = this.state;
    const index = blocks.findIndex(bl => bl.id == block.id);
    blocks[index] = block;
    this.setState({ blocks });
  };

  toggleEditPi = index => {
    let { isEditingPi, selectedPi } = this.state;
    selectedPi = this.state.pis[index];
    this.setState({ isEditingPi: !isEditingPi, selectedPi });
  };

  editPi = pi => {
    const { selectedPi, pis } = this.state;
    const piIndex = pis.findIndex(pi => pi === selectedPi);
    pis[piIndex] = pi;
    this.setState({ pis, selectedPi: null, isEditingPi: false });
  };

  setSelectedBlock = block => {
    if (this.state.view == "calendar") {
      this.setState({ selectedBlock: block });
    }
  };

  editSelectedBlock = blockIndex => {
    this.setState({
      selectedBlock: this.state.blocks[blockIndex],
      selectedBlockEdit: this.state.blocks[blockIndex],
      view: "block"
    });
  };

  changeView = view => {
    let {
      selectedCalendar,
      calendars,
      selectedBlockEdit,
      selectedBlock
    } = this.state;
    if (view === "block") {
      selectedBlockEdit = null;
      selectedBlock = null;
      selectedCalendar = calendars.length > 0 ? calendars[0].id : 0;
    }
    this.setState({ view, selectedCalendar, selectedBlockEdit, selectedBlock });
  };

  handleCalendarChange = event => {
    this.setState({ selectedCalendar: event.target.value });
  };

  publishChanges = () => {
    alert("Changes published");
  };

  toggleCalendarDialog = () => {
    const { isCalendarDialogShowing } = this.state;
    this.setState({ isCalendarDialogShowing: !isCalendarDialogShowing });
  };

  addCalendarHandler = name => {
    const { calendars } = this.state;
    const calendarObj = {
      id: 9999,
      name
    };
    calendars.push(calendarObj);
    this.toggleCalendarDialog();
    this.setState({ calendars });
  };

  render() {
    return (
      <div className="App">
        <div className="grid">
          <div className="left-menu-wrapper">
            <PiList items={this.state.pis} toggleEditPi={this.toggleEditPi} />
            <div />
            <Card raised>
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
                  onClick={() => this.changeView("block")}
                  style={{ margin: "5px" }}
                  disabled={
                    this.state.view === "block" &&
                    this.state.selectedBlockEdit === null
                  }
                >
                  Build a new block
                </Button>
                <Button
                  variant="raised"
                  color={"primary"}
                  onClick={() => this.changeView("calendar")}
                  style={{ margin: "5px" }}
                  disabled={this.state.view === "calendar"}
                >
                  Schedule blocks
                </Button>
              </CardContent>
            </Card>
            <Card
              style={{
                backgroundColor:
                  this.state.view === "block" ? "cornflowerblue" : "#f50057",
                color: this.state.view === "block" ? "black" : "white",
                transition: "all 0.5s ease-in"
              }}
            >
              <CardContent>
                {this.state.view === "block" ? (
                  <Fragment>
                    <h1>Build blocks!</h1>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Cupiditate voluptate sequi suscipit aliquid assumenda,
                      iure debitis totam ipsum quisquam? Sunt.
                    </p>
                  </Fragment>
                ) : (
                  <Fragment>
                    <h1>Calendar</h1>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Reiciendis, perspiciatis?
                    </p>
                    <div className="flex">
                      <Event style={{ marginRight: 10 }} />
                      <Select
                        value={this.state.selectedCalendar}
                        onChange={this.handleCalendarChange}
                        fullWidth
                        className="white-select"
                      >
                        {this.state.calendars.map(calendar => (
                          <MenuItem value={calendar.id}>
                            {calendar.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                    <Button
                      variant="raised"
                      onClick={this.publishChanges}
                      color="primary"
                      style={{ marginTop: "15px", marginRight: "20px" }}
                    >
                      Publish changes <Share style={{ marginLeft: 20 }} />
                    </Button>
                  </Fragment>
                )}
              </CardContent>
            </Card>
            <Card raised style={{ alignSelf: "flex-start" }}>
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
            <Card>
              <CardContent>
                <h2>Your blocks</h2>
                <BlockList
                  items={this.state.blocks}
                  setSelectedBlock={this.setSelectedBlock}
                  selectedBlock={this.state.selectedBlock}
                  editSelectedBlock={this.editSelectedBlock}
                />
              </CardContent>
            </Card>
            <UploadDialog
              show={this.state.isUploading}
              toggleUploadDialog={this.toggleUploadDialog}
              addBlock={this.addBlock}
            />
            {this.state.isEditingPi && (
              <PiDialog
                show={this.state.isEditingPi}
                calendars={this.state.calendars}
                pi={this.state.selectedPi}
                editPi={this.editPi}
                toggleEditPi={this.toggleEditPi}
              />
            )}
          </div>
          <div>
            {this.state.view === "block" ? (
              <PiContentList
                addBlock={this.addBlock}
                editBlock={this.editBlock}
                items={this.state.picontent}
                block={this.state.selectedBlockEdit}
              />
            ) : (
              <Calendar
                selectedBlock={this.state.selectedBlock}
                selectedCalendar={this.state.selectedCalendar}
              />
            )}
          </div>
        </div>
        {this.state.view == "calendar" && (
          <Fragment>
            <div className="new-calendar-btn mui-fixed">
              <Button
                variant="fab"
                color="primary"
                onClick={this.toggleCalendarDialog}
              >
                <Add />
              </Button>
            </div>
            <CalendarDialog
              addCalendar={this.addCalendarHandler}
              toggleCalendarDialog={this.toggleCalendarDialog}
              show={this.state.isCalendarDialogShowing}
            />
          </Fragment>
        )}
      </div>
    );
  }
}

export default App;
