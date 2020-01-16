import React, { Component } from "react";
import { Profile } from "./models/profile";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Moment from "react-moment";
import TimeAgo from "react-timeago";

interface Props {
  profiles: Profile[];
  onManage: any;
  onPage: any;
  onSort: any;
  onFilter: any;
  loading: boolean;
  totalRecords: number;
  rows: number;
  first: number;
}

export class ProfileList extends Component<Props, {}> {
  manageAction = (event: any, rowData: any) => {
    event.preventDefault();
    this.props.onManage(rowData);
  };

  manageTemplate = (rowData: any, column: any) => {
    return (
      <div>
        <Button
          icon="pi pi-external-link"
          onClick={event => this.manageAction(event, rowData)}
        />
      </div>
    );
  };

  dateTemplate = (rowData: any, column: any) => {
    const dt = rowData["logDate"];
    return (
      <span>
        <Moment format="DD MMM YYYY ">{dt}</Moment>
      </span>
    );
  };

  elapsedTemplate = (rowData: any, column: any) => {
    const dt = rowData["logDate"];
    return (
      <span>
        <TimeAgo date={dt}></TimeAgo>
      </span>
    );
  };

  render() {
    const header = (
      <div className="p-clearfix" style={{ lineHeight: "1.87em" }}>
        Profiles
      </div>
    );

    return (
      <DataTable
        value={this.props.profiles}
        header={header}
        loading={this.props.loading}
        paginator={true}
        rows={this.props.rows}
        rowsPerPageOptions={[50, 100, 200, 500]}
        totalRecords={this.props.totalRecords}
      >
        <Column field="code" header="Code" sortable={true} filter={true} />
        <Column field="name" header="Facility" sortable={true} filter={true} />
        <Column
          field="facilityInfo.masterFacility.county.name"
          header="County"
          sortable={true}
          filter={true}
        />
        <Column field="docket" header="Docket" sortable={true} filter={true} />
        <Column field="patientCount" header="Expected" sortable={true} />
        <Column field="recievedCount" header="Recieved" sortable={true} />
        <Column
          field="logDate"
          header="Updated"
          body={this.dateTemplate}
          sortable={true}
        />
        <Column field="logDate" header="" body={this.elapsedTemplate} />
        <Column
          body={this.manageTemplate}
          style={{ textAlign: "center", width: "5em" }}
        />
      </DataTable>
    );
  }
}
