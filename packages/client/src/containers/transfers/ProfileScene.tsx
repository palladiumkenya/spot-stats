import React, { Component } from "react";
import { Profile } from "./models/profile";
import axios from "axios";
import { Growl } from "primereact/growl";
import { ProfileList } from "./ProfileList";

interface State {
  profiles: Profile[];
}

const url = "./api/v1/transfers/manifests/";

export class ProfileScene extends Component<{}, State> {
  private messages: any;

  constructor(props: Readonly<{}>) {
    super(props);
    this.state = {
      profiles: []
    };
  }

  loadData = async () => {
    try {
      let res = await axios.get(url);
      let data = res.data;
      this.setState({
        profiles: data
      });
    } catch (e) {
      this.messages.show({
        severity: "error",
        summary: "Error loading",
        detail: `${e}`
      });
    }
  };

  handleManage = (rowData: any) => {
    console.log("show this", rowData);
  };

  async componentDidMount() {
    await this.loadData();
  }

  render() {
    return (
      <div>
        <Growl ref={el => (this.messages = el)} />
        <div>
          {this.state.profiles ? (
            <ProfileList
              profiles={this.state.profiles}
              onManage={this.handleManage}
            />
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
}
