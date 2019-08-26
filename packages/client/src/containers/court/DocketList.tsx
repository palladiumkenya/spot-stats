import React, { Component } from "react";
import { Docket } from "./models/docket";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Extract } from "./models/extract";
import { ExtractList } from "./ExtractList";

interface Props {
  dockets: Docket[];
  onManage: any;
  onAdd: any;
}

interface State {
  selectedDocket: Docket;
}

export class DocketList extends Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      selectedDocket: {}
    };
  }

  manageAction = (event: any, rowData: any) => {
    event.preventDefault();
    this.props.onManage(rowData);
  };

  addAction = (event: any) => {
    event.preventDefault();
    this.props.onAdd();
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
        Dockets
        <Button
          onClick={this.addAction}
          icon="pi pi-plus"
          style={{ float: "right" }}
        />
      </div>
    );

    return (
      <div className="p-grid">
        <div className="p-col-6">
          <DataTable
            value={this.props.dockets}
            header={header}
            selectionMode="single"
            selection={this.state.selectedDocket}
            onSelectionChange={e => this.setState({ selectedDocket: e.value })}
          >
            <Column field="display" header="Display" />
            <Column
              body={this.manageTemplate}
              style={{ textAlign: "center", width: "5em" }}
            />
          </DataTable>
        </div>
        <div className="p-col-6">
          {this.state.selectedDocket ? (
            <ExtractList docket={this.state.selectedDocket} />
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }
}
