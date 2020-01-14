import React, { Component } from "react";
import { Docket } from "./models/docket";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { DocketForm } from "./DocketForm";
import { Growl } from "primereact/growl";
import { DocketList } from "./DocketList";

interface State {
  dockets: Docket[];
  showForm: boolean;
  editMode: boolean;
  activeDocket: Docket;
}

const url = `https://${window.location.hostname}:4720/api/v1/courts/dockets/`;

export class DocketScene extends Component<{}, State> {
  private messages: any;

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      dockets: [],
      showForm: false,
      editMode: false,
      activeDocket: {
        _id: "00000000-0000-0000-0000-000000000000",
        name: "",
        display: ""
      }
    };
  }

  loadData = async () => {
    try {
      let res = await axios.get(url);
      let data = res.data;
      this.setState(prevState => ({
        ...prevState,
        dockets: data
      }));
    } catch (e) {
      this.messages.show({
        severity: "error",
        summary: "Error loading",
        detail: `${e}`
      });
    }
  };

  handleAdd = () => {
    this.resetState();
    this.setState(prevState => ({
      ...prevState,
      showForm: true
    }));
  };

  handleManage = (rowData: any) => {
    this.setState(prevState => ({
      ...prevState,
      activeDocket: rowData,
      showForm: true,
      editMode: true
    }));
  };

  handleSave = async (form: any) => {
    this.messages.clear();
    try {
      let res = await axios.post(url, form);
      let savedDocket = res.data;
      this.messages.show({
        severity: "success",
        summary: "Saved successfully",
        detail: `${savedDocket.name}`
      });
      this.resetState();
      this.loadData();
    } catch (e) {
      this.messages.show({
        severity: "error",
        summary: "Error occurred",
        detail: `${e}`
      });
    }
  };

  handleDelete = async (form: any) => {
    this.messages.clear();
    try {
      await axios.delete(`${url}${form._id}`, form);
      this.messages.show({
        severity: "success",
        summary: "Deleted successfully",
        detail: `${form.name}`
      });
      this.resetState();
      this.loadData();
    } catch (e) {
      this.messages.show({
        severity: "error",
        summary: "Error ocurred",
        detail: `${e}`
      });
    }
  };

  handleCancel = (form: any) => {
    this.resetState();
    this.handleHide();
  };

  handleHide = () => {
    this.setState(prevState => ({
      ...prevState,
      showForm: false
    }));
  };

  resetState = () => {
    this.setState({
      showForm: false,
      editMode: false,
      activeDocket: {
        _id: "00000000-0000-0000-0000-000000000000",
        name: "",
        display: ""
      }
    });
  };

  async componentDidMount() {
    await this.loadData();
  }

  render() {
    console.log(url);
    return (
      <div>
        <Growl ref={el => (this.messages = el)} />
        <div>
          {this.state.dockets ? (
            <DocketList
              dockets={this.state.dockets}
              onManage={this.handleManage}
              onAdd={this.handleAdd}
            />
          ) : (
            <div />
          )}
        </div>
        <Dialog
          header="Docket"
          visible={this.state.showForm}
          style={{ width: "50vw" }}
          onHide={this.handleHide}
          maximizable
        >
          {this.state.showForm ? (
            <DocketForm
              docket={this.state.activeDocket}
              onSave={this.handleSave}
              onDelete={this.handleDelete}
              onCancel={this.handleCancel}
            />
          ) : (
            <div />
          )}
        </Dialog>
      </div>
    );
  }
}
