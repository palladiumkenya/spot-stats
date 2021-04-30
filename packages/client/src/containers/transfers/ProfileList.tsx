import React, {Component} from "react";
import {Profile} from "./models/profile";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import Moment from "react-moment";
import TimeAgo from "react-timeago";
import moment from "moment";

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
    private dt: any;

    constructor(props: Props | Readonly<Props>) {
        super(props);

        this.exportCSV = this.exportCSV.bind(this);
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    manageAction = (event: any, rowData: any) => {
        event.preventDefault();
        this.props.onManage(rowData);
    };

    manageTemplate = (rowData: any, column: any) => {
        return (
            <div>
                <Button
                    icon="pi pi-plus"
                    onClick={(event) => this.manageAction(event, rowData)}
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
        const utcDt = moment.utc(rowData["buildDate"]).toDate();
        const dt = moment(utcDt).local(true).toDate().valueOf();
        return (
            <span>
        <TimeAgo live={false} date={dt}></TimeAgo>
      </span>
        );
    };

    numExpTemplate = (rowData: any, column: any) => {
        let dt = rowData["recievedCount"];
        if (rowData["recievedCount"]) {
            dt = Number(rowData["recievedCount"]).toLocaleString();
        }
        return (
            <span>
          {dt}
      </span>
        );
    };

    numRecTemplate = (rowData: any, column: any) => {
        let dt = rowData["recievedCount"];
        if (rowData["recievedCount"]) {
            dt = Number(rowData["recievedCount"]).toLocaleString();
        }
        return (
            <span>
          {dt}
      </span>
        );
    };

    render() {
        const header = (
            <div>
                <div className="p-clearfix" style={{lineHeight: "1.87em"}}>
                    Profiles
                    <Button
                        type="button"
                        icon="pi pi-external-link"
                        label="Export to CSV"
                        className="p-button-success"
                        onClick={this.exportCSV}
                        style={{float: "left"}}
                    ></Button>
                </div>
            </div>
        );

        return (
            <DataTable
                value={this.props.profiles.map(l => {
                    if (l.docket === 'NDWH') {
                        l.docket = 'C&T';
                    } else if (l.docket === 'MPI') {
                        l.docket = 'PKV';
                    }
                    return l;
                })}
                header={header}
                loading={this.props.loading}
                paginator={true}
                rows={this.props.rows}
                rowsPerPageOptions={[50, 100, 200, 500]}
                totalRecords={this.props.totalRecords}
                ref={(el) => {
                    this.dt = el;
                }}
            >
                <Column field="code" header="Code" sortable={true} filter={true}/>
                <Column
                    field="name"
                    header="Facility"
                    sortable={true}
                    filter={true}
                    filterMatchMode={"contains"}
                />
                <Column
                    field="facility.masterFacility.county.name"
                    header="County"
                    sortable={true}
                    filter={true}
                    filterMatchMode={"contains"}
                />
                <Column
                    field="facility.masterFacility.mechanism.name"
                    header="Partner"
                    sortable={true}
                    filter={true}
                    filterMatchMode={"contains"}
                />
                <Column field="docket" header="Docket" sortable={true} filter={true}/>
                <Column field="patientCount" header="Expected" sortable={true} body={this.numExpTemplate}/>
                <Column field="recievedCount" header="Received" sortable={true} body={this.numRecTemplate}/>
                <Column field="handshakeStatus" header="Status" sortable={true}/>
                <Column
                    field="logDate"
                    header="Updated"
                    body={this.dateTemplate}
                    sortable={true}
                />
                <Column field="logDate" header="" body={this.elapsedTemplate}/>
                <Column
                    body={this.manageTemplate}
                    style={{textAlign: "center", width: "5em"}}
                />
            </DataTable>
        );
    }
}
