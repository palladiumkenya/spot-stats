import React, { Component } from "react";
import { Profile } from "./models/profile";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

interface Props {
  profiles: Profile[];
  onManage: any;
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

  render() {
    const header = (
      <div className="p-clearfix" style={{ lineHeight: "1.87em" }}>
        Profiles
      </div>
    );

    return (
      <DataTable value={this.props.profiles} header={header}>
        <Column field="code" header="Code" />
        <Column field="name" header="Facility" />
        <Column
          field="facilityInfo.masterFacility.county.name"
          header="County"
        />
        <Column field="docket" header="Docket" />
        <Column field="patientCount" header="Expected" />
        <Column field="recievedCount" header="Recieved" />
        <Column field="logDate" header="Updated" />
        <Column
          body={this.manageTemplate}
          style={{ textAlign: "center", width: "5em" }}
        />
      </DataTable>
    );
  }
}
