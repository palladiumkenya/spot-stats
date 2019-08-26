import React, { Component } from "react";
import { Docket } from "./models/docket";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Extract } from "./models/extract";

interface Props {
  docket: Docket;
}

export class ExtractList extends Component<Props, {}> {
  constructor(props: Readonly<Props>) {
    super(props);
  }

  render() {
    const header = (
      <div className="p-clearfix" style={{ lineHeight: "1.87em" }}>
        {this.props.docket.display} Extracts
      </div>
    );

    return (
      <div>
        <DataTable value={this.props.docket.extracts} header={header}>
          <Column field="name" header="name" />
          <Column field="display" header="Display" />
          <Column field="rank" header="Rank" />
        </DataTable>
      </div>
    );
  }
}
