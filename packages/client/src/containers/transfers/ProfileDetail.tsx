import React, { Component } from "react";
import { ProfileScene } from "./ProfileScene";
import { ProfileSummary } from "./models/profile-summary";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TabPanel, TabView } from "primereact/tabview";
import Moment from "react-moment";
import {Indicator} from "./models/indicator";
import {Button} from "primereact/button";
import {Manifest} from "./models/manifest";
interface Prop {
  profile: ProfileSummary;
  indicators: Indicator[];
}
export class ProfileDetail extends Component<Prop, {}> {
  dateTemplate = (rowData: any, column: any) => {
    const dt = rowData["logDate"];
    return (
      <span>
        <Moment format="DD MMM YYYY">{dt}</Moment>
      </span>
    );
  };
  date2Template = (rowData: any, column: any) => {
    const dt = rowData["updated"];
    return (
      <span>
        <Moment format="DD MMM YYYY">{dt}</Moment>
      </span>
    );
  };

  date3Template = (rowData: any, column: any) => {
    const dt = rowData["report"];
    const ll = JSON.parse(JSON.stringify(rowData["measure"]));

    if (dt && dt === "Demo EMR") return <span></span>;
    if (dt && dt === "v1.0.0.0") return <span></span>;
    if (dt && dt.startsWith("1983")) return <span></span>;

    if (ll.display.startsWith("Last") && dt) {
      return (
        <span>
          <Moment format="DD MMM YYYY">{dt}</Moment>
        </span>
      );
    }
    return <span>{dt} </span>;
  };

  render() {
    if (!this.props.profile) {
      return <div />;
    } else {
      const dwhSummaries = this.props.profile.summaries!.filter(
        (x) => x.docket.name === "NDWH"
      );
      const htsSummaries = this.props.profile.summaries!.filter(
        (x) => x.docket.name === "HTS"
      );
      const mpiSummaries = this.props.profile.summaries!.filter(
        (x) => x.docket.name === "MPI"
      );
      const mgsSummaries = this.props.profile.summaries!.filter(
        (x) => x.docket.name === "MGS"
      );

      // @ts-ignore
      this.props.profile.manifests.sort(function (a: Manifest, b: Manifest) {
        // @ts-ignore
        const logDateA = new Date(a.logDate.toString()).getTime();
        // @ts-ignore
        const logDateB = new Date(b.logDate.toString()).getTime();
        return logDateB - logDateA;
      });

      const dateBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
              <Moment format="DD MMM YYYY HH:mm:ss">{rowData.indicatorDate}</Moment>
            </React.Fragment>
        );
      }

      const differenceFunc = (rowData: any) => {
        if (rowData.value && rowData.dwhValue) {
          const val = parseInt(rowData.value, 10);
          const dwhVal = parseInt(rowData.dwhValue, 10);
          return val - dwhVal;
        } else {
          return null;
        }
      }

      const paginatorLeft = <Button type="button" icon="pi pi-refresh" className="p-button-text" />;
      const paginatorRight = <Button type="button" icon="pi pi-cloud" className="p-button-text" />;

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
            <div className={'p-grid'}>
              <div className="p-col-8">
                <TabView>
                  <TabPanel header="NDWH">
                    <DataTable value={dwhSummaries}>
                      <Column field="extract.display" header="Extract" />
                      <Column field="recieved" header="Recieved" />
                      <Column field="expected" header="Expected" />
                      <Column
                          field="updated"
                          header="Update"
                          body={this.date2Template}
                      />
                    </DataTable>
                  </TabPanel>

                  <TabPanel header="HTS">
                    <DataTable value={htsSummaries}>
                      <Column field="extract.display" header="Extract" />
                      <Column field="recieved" header="Recieved" />
                      <Column field="expected" header="Expected" />
                      <Column
                          field="updated"
                          header="Update"
                          body={this.date2Template}
                      />
                    </DataTable>
                  </TabPanel>

                  <TabPanel header="MPI">
                    <DataTable value={mpiSummaries}>
                      <Column field="extract.display" header="Extract" />
                      <Column field="recieved" header="Recieved" />
                      <Column field="expected" header="Expected" />
                      <Column
                          field="updated"
                          header="Update"
                          body={this.date2Template}
                      />
                    </DataTable>
                  </TabPanel>
                  <TabPanel header="MGS">
                    <DataTable value={mgsSummaries}>
                      <Column field="extract.display" header="Extract" />
                      <Column field="recieved" header="Recieved" />
                      <Column field="expected" header="Expected" />
                      <Column
                          field="updated"
                          header="Update"
                          body={this.date2Template}
                      />
                    </DataTable>
                  </TabPanel>
                </TabView>
              </div>
              <div className="p-col-4">
                <DataTable
                    paginator
                    value={this.props.profile.manifests}
                    header="Uploads History"
                    rows={5} rowsPerPageOptions={[5, 10,20,50]}
                    paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}
                >
                  <Column
                      field="logDate"
                      header="Date"
                      body={this.dateTemplate}
                  />
                  <Column field="docket" header="Docket" />
                  <Column field="patientCount" header="Patient Count" />
                </DataTable>
              </div>
            </div>
            <div className={'p-grid'}>
              <div className="p-col-8">
                <DataTable
                    value={this.props.profile.metrics}
                    header="Facility Metrics"
                >
                  <Column field="measure.display" header="Measure" />
                  <Column
                      field="report"
                      header="Metric"
                      body={this.date3Template}
                  />
                  <Column field="measure.description" header="Description" />
                </DataTable>
              </div>
            </div>
            <div className={'p-grid'}>
              <div className={'p-col-8'}>
                <DataTable
                value={this.props.indicators}
                header={'Indicator Metrics'}>
                  <Column field={'indicatorDate'} header={'Indicator Date'} body={dateBodyTemplate} />
                  <Column field={'name'} header={'Name'} className={'word-wrap'} />
                  <Column
                      field={'value'} header={'Value'}
                  />
                  <Column field={'dwhValue'} header={'NDWH Calculation'} />
                  <Column field={'dwhIndicatorDate'} header={'NDWH Date'} body={dateBodyTemplate} />
                  <Column field={'value'} header={'Difference'} body={differenceFunc} />
                </DataTable>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
