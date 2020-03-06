import React, { Component } from "react";
import { Profile } from "./models/profile";
import axios from "axios";
import { Growl } from "primereact/growl";
import { ProfileList } from "./ProfileList";
import { Redirect, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { Messages } from "primereact/messages";

interface State {
  showSummary: boolean;
  redirectTo: string;
  profiles: Profile[];
  loading: boolean;
  rows: number;
  totalRecords: number;
  page: number;
  first: number;
  sort: any;
  filter: any;
  notices: any;
}

// @ts-ignore
const url = `https://${window.location.hostname}:4702/api/v1/transfers/manifests`;
const statCountUrl = `https://${window.location.hostname}:4702/api/v1/transfers/manifests/count`;
let noticesUrl = `https://${window.location.hostname}:4702/api/v1/notifications/notices/`;

export class ProfileScene extends Component<any, State> {
  private messages: any;
  private noticeMessages: any;

  constructor(props: Readonly<any>) {
    super(props);
    this.state = {
      profiles: [],
      redirectTo: "",
      showSummary: false,
      loading: false,
      totalRecords: 0,
      rows: 50,
      page: 1,
      first: 0,
      sort: [],
      filter: [],
      notices: []
    };
  }

  loadNotices = async () => {
    this.setState(prevState => ({
      ...prevState,
      loading: true
    }));

    try {
      let res = await axios.get(noticesUrl);
      let notices = res.data.map(
        (noticeBoard: NoticeBoard) => noticeBoard.message
      );

      this.noticeMessages.show({
        sticky: true,
        severity: "info",
        summary: "Please NOTE that:",
        detail: notices.join(",")
      });

      this.setState(prevState => ({
        ...prevState,
        notices: notices
      }));
    } catch (e) {
      this.messages.show({
        severity: "error",
        summary: "Error loading",
        detail: `${e}`
      });
    }
  };

  loadCount = async () => {
    this.setState(prevState => ({
      ...prevState,
      loading: true
    }));

    try {
      let res = await axios.get(statCountUrl);
      let data = res.data;
      this.setState(prevState => ({
        ...prevState,
        totalRecords: data
      }));
    } catch (e) {
      this.messages.show({
        severity: "error",
        summary: "Error loading",
        detail: `${e}`
      });
    }
  };

  loadData = async () => {
    this.setState(prevState => ({
      ...prevState,
      loading: true
    }));

    try {
      let geturl = `${url}/all`;
      // let geturl = `${url}/${this.state.rows}/${this.state.page}`;
      if (this.state.sort) {
        geturl = `${geturl}?sort=${this.state.sort}`;

        if (this.state.filter) {
          geturl = `${geturl}&filter=${this.state.filter}`;
        }
      } else {
        if (this.state.filter) {
          geturl = `${geturl}?filter=${this.state.filter}`;
        }
      }

      let res = await axios.get(geturl);
      let data = res.data;
      this.setState(prevState => ({
        ...prevState,
        loading: false,
        profiles: data
      }));
    } catch (e) {
      this.setState(prevState => ({
        ...prevState,
        loading: false
      }));
      this.messages.show({
        severity: "error",
        summary: "Error loading",
        detail: `${e}`
      });
    }
  };

  handleManage = (rowData: any) => {
    this.setState({
      redirectTo: `/stats/showcase/${rowData.facility._id}`,
      showSummary: true
    });
  };

  handlePage = async (event: any) => {
    console.log(event);
    this.setState(
      prevState => ({
        ...prevState,
        rows: event.rows,
        page: event.page + 1,
        first: event.first
      }),
      () => this.loadData()
    );
  };

  handleSort = async (event: any) => {
    console.log(event);
    this.setState(
      prevState => ({
        ...prevState,
        sort: JSON.stringify(event)
      }),
      () => this.loadData()
    );
  };

  handleFilter = async (event: any) => {
    console.log(event);
    this.setState(
      prevState => ({
        ...prevState,
        filter: JSON.stringify(event)
      }),
      () => this.loadData()
    );
  };

  async componentDidMount() {
    await this.loadNotices();
    await this.loadCount();
    await this.loadData();
  }

  render() {
    if (this.state.showSummary) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      return (
        <div>
          <Messages ref={el => (this.noticeMessages = el)} />
          <Growl ref={el => (this.messages = el)} />
          <div>
            {this.state.profiles ? (
              <ProfileList
                profiles={this.state.profiles}
                onManage={this.handleManage}
                onPage={this.handlePage}
                loading={this.state.loading}
                totalRecords={this.state.totalRecords}
                rows={this.state.rows}
                first={this.state.first}
                onSort={this.handleSort}
                onFilter={this.handleFilter}
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
