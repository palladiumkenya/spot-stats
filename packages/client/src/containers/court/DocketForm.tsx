import React, { Component } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Docket } from "./models/docket";

interface Props {
  onSave: any;
  onCancel: any;
  onDelete: any;
  docket: Docket;
}

interface State {
  docket: Docket;
}

export class DocketForm extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      docket: props.docket
    };
  }

  saveAction = (event: any) => {
    event.preventDefault();
    this.props.onSave(this.state.docket);
  };

  cancelAction = (event: any) => {
    event.preventDefault();
    this.props.onCancel(this.state.docket);
  };

  deleteAction = (event: any) => {
    event.preventDefault();
    this.props.onDelete(this.state.docket);
  };

  handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState(prevState => ({
      docket: {
        ...prevState.docket,
        [name]: value
      }
    }));
  };

  render() {
    return (
      <div>
        <form>
          <InputText
            type="text"
            value={this.state.docket._id}
            name="_id"
            readOnly
            onChange={this.handleInputChange}
          />
          <InputText
            type="text"
            value={this.state.docket.name}
            name="name"
            onChange={this.handleInputChange}
          />
          <InputText
            type="text"
            value={this.state.docket.display}
            name="display"
            onChange={this.handleInputChange}
          />
          <Button
            onClick={this.saveAction}
            label="Save"
            icon="pi pi-check"
            className="p-button-success"
          />
          <Button
            onClick={this.cancelAction}
            label="Cancel"
            icon="pi pi-times"
          />
          <Button
            onClick={this.deleteAction}
            label="Delete"
            icon="pi pi-trash"
            className="p-button-danger"
            style={{ float: "right" }}
          />
        </form>
      </div>
    );
  }
}
