import React, { Component } from "react";
import { ProfileScene } from "./ProfileScene";

export class ProfileHome extends Component<any, any> {
  render() {
    return (
      <div>
        <div className="p-grid">
          <div className="p-col">
            <ProfileScene />
          </div>
        </div>
      </div>
    );
  }
}
