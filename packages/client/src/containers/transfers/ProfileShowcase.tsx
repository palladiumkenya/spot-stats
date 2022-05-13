import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";

import { ProfileSummary } from "./models/profile-summary";
import axios from "axios";
import { Growl } from "primereact/growl";
import { Messages } from "primereact/messages";
import { ProfileDetail } from "./ProfileDetail";
import {Indicator} from "./models/indicator";

interface MatchParams {
  id: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

interface State {
  profileSummary: ProfileSummary;
  indicators: Indicator[];
}

let url = `https://${window.location.hostname}:4720/api/v1/transfers/facilities/`;
let indicatorsUrl = `https://${window.location.hostname}:4720/api/v1/metrics/facmetrics/getIndicatorsByFacilityId/`;

class ProfileShowcase extends Component<Props, State> {
  private messages: any;

  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      profileSummary: {
        summaries: [],
        manifests: [],
      },
      indicators: []
    };
  }

  loadData = async (id: string) => {
    this.messages.clear();
    if (!id) {
      this.messages.show({
        severity: "error",
        summary: "No facilities specified !",
      });
      return;
    }
    try {
      let res = await axios.get(`${url}${id}`);
      let data = res.data;
      console.log('data', data)
      this.setState({
        profileSummary: data,
      });
    } catch (e) {
      this.messages.show({
        severity: "error",
        summary: "Error loading",
        detail: `${e}`,
      });
    }
  };

  loadIndicators =  async (id: string) => {
    this.messages.clear();
    if (!id) {
      this.messages.show({
        severity: "error",
        summary: "No indicators specified !",
      });
      return;
    }

    try {
      let res = await axios.get(`${indicatorsUrl}${id}`);
      let data = res.data;
      this.setState({
        indicators: data,
      });
    } catch (e) {
      this.messages.show({
        severity: "error",
        summary: "Error loading",
        detail: `${e}`,
      });
    }
  }

  async componentDidMount() {
    this.loadData(this.props.match.params.id);
    this.loadIndicators(this.props.match.params.id);
  }

  render() {
    if (!this.state.profileSummary) {
      return <div />;
    }
    return (
      <div>
        <Messages ref={(el) => (this.messages = el)} />
        <hr />
        {this.state.profileSummary ? (
          <div>
            <ProfileDetail profile={this.state.profileSummary}  indicators={this.state.indicators}/>
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

export default withRouter(ProfileShowcase);
