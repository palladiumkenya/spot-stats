import React, { Component } from "react";
import { ProfileScene } from "./ProfileScene";
import { ProfileSummary } from "./models/profile-summary";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TabPanel, TabView } from "primereact/tabview";
interface Prop {
  profile: ProfileSummary;
}
export class ProfileDetail extends Component<Prop, {}> {
  render() {
    if (!this.props.profile) {
      return <div />;
    } else {
      const dwhSummaries = this.props.profile.summaries!.filter(
        x => x.docket.name === "NDWH"
      );
      const htsSummaries = this.props.profile.summaries!.filter(
        x => x.docket.name === "HTS"
      );
      return (
        <div>
          <div className="p-grid">
            <div className="p-col-12">
              <Card title={this.props.profile.name}>
                <div className="p-grid">
                  <div className="p-col-1">Code</div>
                  <div className="p-col-2">{this.props.profile.code}</div>
                </div>
              </Card>
            </div>
            <div className="p-col-8">
              <TabView>
                <TabPanel header="NDWH">
                  <DataTable value={dwhSummaries}>
                    <Column field="extract.display" header="Extract" />
                    <Column field="recieved" header="Recieved" />
                    <Column field="expected" header="Expected" />
                    <Column field="updated" header="Update" />
                  </DataTable>
                </TabPanel>
                <TabPanel header="HTS">
                  <DataTable value={htsSummaries}>
                    <Column field="extract.display" header="Extract" />
                    <Column field="recieved" header="Recieved" />
                    <Column field="expected" header="Expected" />
                    <Column field="updated" header="Update" />
                  </DataTable>
                </TabPanel>
              </TabView>
            </div>
            <div className="p-col-4">
              <DataTable
                value={this.props.profile.manifests}
                header="Uploads History"
              >
                <Column field="logDate" header="Date" />
                <Column field="docket" header="Docket" />
                <Column field="patientCount" header="Patient Count" />
              </DataTable>
            </div>
          </div>
        </div>
      );
    }
  }
}
