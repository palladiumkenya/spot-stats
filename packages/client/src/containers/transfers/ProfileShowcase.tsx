import React, { Component } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Profile } from "./models/profile";

interface Props {
  onSave: any;
  onCancel: any;
  onDelete: any;
  profile: Profile;
}

interface State {
  profile: Profile;
}

export class ProfileShowcase extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      profile: props.profile
    };
  }

  saveAction = (event: any) => {
    event.preventDefault();
    this.props.onSave(this.state.profile);
  };

  cancelAction = (event: any) => {
    event.preventDefault();
    this.props.onCancel(this.state.profile);
  };

  deleteAction = (event: any) => {
    event.preventDefault();
    this.props.onDelete(this.state.profile);
  };

  handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState(prevState => ({
      profile: {
        ...prevState.profile,
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
            value={this.state.profile._id}
            name="_id"
            readOnly
            onChange={this.handleInputChange}
          />
          <InputText
            type="text"
            value={this.state.profile.name}
            name="name"
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
