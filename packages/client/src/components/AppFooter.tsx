import React from "react";
import {Component} from "react";

interface Props {
}

interface State {
}

export class AppFooter extends Component<Props, State> {
    render() {
        return (
            <div className="footer">
                <div className="card clearfix">
                    <span className="footer-text-left">PrimeReact ULTIMA for React</span>
                    <span className="footer-text-right">
                        <span className="ui-icon ui-icon-copyright"></span>
                        <span>All Rights Reserved</span>
                    </span>
                </div>
            </div>
        );
    }
}
