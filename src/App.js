import React, { Component, Fragment } from "react";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Event, Share, Add } from "@material-ui/icons";
import PiList from "./components/PiList/PiList";
import axios from "./axios";
import "./App.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import UploadDialog from "./components/UploadDialog/UploadDialog";
import BlockList from "./components/BlockList/BlockList";
import PiContentList from "./components/PiContentList/PiContentList";
import Calendar from "./components/Calendar/Calendar";
import PiDialog from "./components/PiDialog/PiDialog";
import CalendarDialog from "./components/CalendarDialog/CalendarDialog";
import { Select, MenuItem, CardActions, Menu } from "@material-ui/core";
import client from "./realtime";

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
    calendars: [],
    gym_id: 1875,
    isDublicating: null // ref to button
  };

  componentDidMount() {
    const queryParams = new URLSearchParams(
      window.location.href.substr(window.location.href.indexOf("?"))
    );
    const entries = queryParams.entries();
    for (const pair of entries) {
      console.log(pair[0] + ", " + pair[1]);
    }
    console.log(
      "URL",
      window.location.href.substr(window.location.href.indexOf("?")),
      queryParams.get("gym_id")
    );
    if (queryParams.get("gym_id")) {
      console.log("Query Params found!", queryParams.get("gym_id"));
      this.setState({ gym_id: parseInt(queryParams.get("gym_id")) }, () =>
        this.getDataFromApiOnStartUp()
      );
    } else {
      this.getDataFromApiOnStartUp();
    }
  }

  getDataFromApiOnStartUp = () => {
    const getPis = axios.get(`/v1/pi?gym_id=${this.state.gym_id}`);
    const getBlocks = axios.get(`/v1/pi/blocks?gym_id=${this.state.gym_id}`);
    const getContent = axios.get(`/v1/pi/content?gym_id=${this.state.gym_id}`);
    const getCalendars = axios.get(
      `/v1/pi/calendars?gym_id=${this.state.gym_id}`
    );
    Promise.all([getPis, getBlocks, getContent, getCalendars]).then(values => {
      const pis = values[0].data;
      const blocks = values[1].data;
      const content = values[2].data;
      const calendars = values[3].data;
      let calendarsResult = [{ id: 0 }];
      if (calendars.length > 0) {
        calendarsResult = calendars.map(calendar => ({
          name: calendar.name,
          id: calendar.id
        }));
      }
      const contentResult = content.map(piC => ({
        ...piC,
        content_id: piC.id
      }));
      this.setState({
        calendars: calendarsResult,
        selectedCalendar: calendarsResult[0].id,
        picontent: contentResult,
        blocks,
        pis
      });
    });
  };

  toggleUploadDialog = () => {
    const { isUploading } = this.state;
    this.setState({ isUploading: !isUploading });
  };

  addContent = async (content, save) => {
    const { picontent } = this.state;
    picontent.push({
      name: content.name,
      duration: content.duration,
      type: 4,
      gym_id: this.state.gym_id,
      provider_id: null,
      id: content.id
    });
    console.log(save);
    if (save) {
      console.log("adding block");
      const block = {
        block: {
          duration: content.duration,
          gym_id: this.state.gym_id,
          name: content.name
        },
        items: [content.id]
      };
      this.addBlock(block);
    }
    this.setState({ picontent });
  };

  addBlock = async block => {
    const { blocks } = this.state;
    if (!block.block.gym_id) {
      block.block.gym_id = this.state.gym_id;
    }
    const result = await axios.post(`/v2/blocks`, block);
    const newBlock = {
      duration: block.block.duration,
      name: block.block.name,
      id: result.data.id,
      gym_id: this.state.gym_id
    };
    blocks.push(newBlock);
    this.setState({ blocks });
  };

  editBlock = (id, block) => {
    const { blocks } = this.state;
    const finalBlock = [];
    let finalDuration = 0;
    block.forEach(blockItem => {
      for (let i = 0; i < blockItem.amount; i++) {
        finalDuration += blockItem.duration;
        finalBlock.push({ content_id: blockItem.content_id, block_id: id });
      }
    });
    const index = blocks.findIndex(bl => bl.id == block.id);
    blocks[index] = { id, duration: finalDuration };
    console.log("block updated to ", { id, duration: finalDuration });
    console.log("finalBlock", finalBlock);
    console.log("finalDuration", finalDuration);
    axios.put(`/v2/blocks/${id}`, {
      block: { duration: finalDuration },
      items: finalBlock
    });
    this.setState({ blocks });
  };

  toggleEditPi = index => {
    let { isEditingPi, selectedPi } = this.state;
    selectedPi = this.state.pis[index];
    this.setState({ isEditingPi: !isEditingPi, selectedPi });
  };

  editPi = async pi => {
    const { selectedPi, pis } = this.state;
    const payload = new FormData();
    if (pi.screensaver) {
      payload.append("file", pi.screensaver);
    }
    payload.append("calendar_id", pi.calendar_id);
    payload.append("name", pi.name);
    const result = await axios.put(`/v2/pi/${pi.id}`, payload);
    const piIndex = pis.findIndex(pi => pi === selectedPi);
    // set new screensaver if we uploaded one
    if (pi.screensaver) {
      pi.screensaver = result.data;
    } else {
      pi.screensaver = pis[piIndex].screensaver;
    }
    pis[piIndex] = pi;
    this.setState({ pis, selectedPi: null, isEditingPi: false });
  };

  setSelectedBlock = block => {
    this.setState({ selectedBlock: block, view: "block" });
  };

  changeView = view => {
    let { selectedCalendar, calendars, selectedBlock } = this.state;
    selectedBlock = null;
    if (view === "block") {
      selectedCalendar = calendars.length > 0 ? calendars[0].id : 0;
    }
    this.setState({ view, selectedCalendar, selectedBlock });
  };

  handleCalendarChange = event => {
    this.setState({ selectedCalendar: event.target.value });
  };

  publishChanges = () => {
    const pi = this.state.pis.find(
      pi => pi.calendar_id == this.state.selectedCalendar
    );
    console.log(pi);
    if (pi == undefined) {
      alert("Assign a screen to the schedule before publishing");
    } else {
      console.log("Publishing to PI with id", pi.id);
      client.send("devices:pi_" + pi.id, "refresh");
      alert("Changes published");
    }
  };

  toggleCalendarDialog = () => {
    const { isCalendarDialogShowing } = this.state;
    this.setState({ isCalendarDialogShowing: !isCalendarDialogShowing });
  };

  addCalendarHandler = async name => {
    const { calendars } = this.state;
    const id = await axios.post(`/v2/pi/calendar`, {
      name: name,
      gym_id: this.state.gym_id
    });
    const calendarObj = {
      id: parseInt(id.data),
      name
    };
    calendars.push(calendarObj);
    this.toggleCalendarDialog();
    this.setState({ calendars });
  };

  deleteBlock = async id => {
    const { blocks } = this.state;
    axios.delete(`/v2/blocks/${id}`);
    const index = blocks.findIndex(bl => bl.id == id);
    blocks.splice(index, 1);
    this.setState({ blocks });
  };

  toggleIsDublicating = event => {
    if (event) {
      this.setState({ isDublicating: event.target });
    } else {
      this.setState({ isDublicating: null });
    }
  };

  copyHandler = async to => {
    console.log(this.state.selectedCalendar, to);
    await axios.post(`/v2/blocks/extras/copy`, {
      from: this.state.selectedCalendar,
      to
    });
    this.toggleIsDublicating(null);
    alert("Copy successful!");
  };

  render() {
    return (
      <div className="App">
        <div className="grid">
          <div className="left-menu-wrapper">
            <PiList items={this.state.pis} toggleEditPi={this.toggleEditPi} />
            <div />
            <Card raised style={{ display: "flex", flexDirection: "column" }}>
              <CardContent>
                <h2>Manage your content</h2>
                <p>
                  Create blocks for use in your planner as well as schedule them
                  to your liking.
                </p>
              </CardContent>
              <CardActions style={{ marginTop: "auto" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => this.changeView("block")}
                  disabled={
                    this.state.view === "block" &&
                    this.state.selectedBlock === null
                  }
                >
                  Build a new block
                </Button>
                <Button
                  variant="contained"
                  color={"primary"}
                  onClick={() => this.changeView("calendar")}
                  disabled={this.state.view === "calendar"}
                >
                  Schedule blocks
                </Button>
              </CardActions>
            </Card>
            <Card
              style={{
                backgroundColor:
                  this.state.view === "block" ? "cornflowerblue" : "#f50057",
                color: this.state.view === "block" ? "black" : "white",
                transition: "all 0.5s ease-in"
              }}
            >
              {this.state.view === "block" ? (
                <CardContent>
                  <h1>Build blocks!</h1>
                  <p>
                    Click on any of the thumbnails to the right to start build
                    your block. You can navigate through the pages using the
                    arrows. Click an existing block to edit it. To save changes,
                    press the disc icon.
                  </p>
                </CardContent>
              ) : (
                <Fragment>
                  <CardContent>
                    <h1>Planner</h1>
                    <p>
                      Schedule your blocks by dragging them onto the planner.
                      Press 'Copy' if you wish to duplicate the content on the
                      current selected planner onto another one.
                    </p>
                    <p>
                      Note! This will delete all scheduled blocks on the planner
                      you're copying over to.
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
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      onClick={this.publishChanges}
                      color="default"
                    >
                      Publish <Share style={{ marginLeft: 20 }} />
                    </Button>
                    <Button onClick={this.toggleIsDublicating}>Copy?</Button>
                    <Menu
                      anchorEl={this.state.isDublicating}
                      open={Boolean(this.state.isDublicating)}
                      onClose={() => this.toggleIsDublicating(null)}
                    >
                      {this.state.calendars.map(
                        cal =>
                          cal.id !== this.state.selectedCalendar ? (
                            <MenuItem onClick={() => this.copyHandler(cal.id)}>
                              {cal.name}
                            </MenuItem>
                          ) : null
                      )}
                    </Menu>
                  </CardActions>
                </Fragment>
              )}
            </Card>
            <Card raised style={{ alignSelf: "flex-start" }}>
              <CardContent>
                <h2>Upload your own videos</h2>
                <p>
                  Click the button below to begin uploading your own videos to
                  the planner
                </p>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.toggleUploadDialog}
                >
                  Begin upload wizard
                  <CloudUploadIcon style={{ marginLeft: "15px" }} />
                </Button>
              </CardActions>
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
              addContent={this.addContent}
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
                addContent={this.addContent}
                addBlock={this.addBlock}
                editBlock={this.editBlock}
                items={this.state.picontent}
                block={this.state.selectedBlock}
                deleteBlock={this.deleteBlock}
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
