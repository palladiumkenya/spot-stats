import React, { Component } from "react";
import { Profile } from "./models/profile";
import axios from "axios";
import { Growl } from "primereact/growl";
import { ProfileList } from "./ProfileList";
import { Redirect, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";

interface State {
  showSummary: boolean;
  redirectTo: string;
  profiles: Profile[];
}

// @ts-ignore
const url = `https://${window.location.hostname}:4720/api/v1/transfers/manifests/`;

export class ProfileScene extends Component<any, State> {
  private messages: any;

  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      profiles: [],
      redirectTo: "",
      showSummary: false
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
    this.setState({
      redirectTo: `/stats/showcase/${rowData.facility}`,
      showSummary: true
    });
  };

  async componentDidMount() {
    await this.loadData();
  }

  render() {
    if (this.state.showSummary) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
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
}
