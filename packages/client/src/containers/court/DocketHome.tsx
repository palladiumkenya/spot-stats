import React, { Component } from "react";
import { DocketScene } from "./DocketScene";

export class DocketHome extends Component<any, any> {
  render() {
    return (
      <div>
        <div className="p-grid">
          <div className="p-col">
            <DocketScene />
          </div>
        </div>
      </div>
    );
  }
}
