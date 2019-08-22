import React from "react";
import {Component} from "react";
import classNames from "classnames";
import {ScrollPanel} from "primereact/scrollpanel";

interface Props {
    onContentClick: any,
    expanded: boolean
}

interface State {
    onContentClick: any,
    expanded: boolean
}

export class AppRightPanel extends Component<Props, State> {
    private rightPanelMenuScroller: any;

    render() {

        let className = classNames('layout-rightpanel', {'layout-rightpanel-active': this.props.expanded});

        return (
            <div className={className} onClick={this.props.onContentClick}>
                <ScrollPanel ref={(el) => this.rightPanelMenuScroller = el} style={{height: '100%'}} >
                    <div className="right-panel-scroll-content">
                        <div className="layout-rightpanel-header">
                            <div className="weather-day">Wednesday</div>
                            <div className="weather-date">Jan 26</div>
                        </div>

                        <div className="layout-rightpanel-content">
                            <h1>Weather</h1>
                            <h2>San Francisco, USA</h2>

                            <div className="weather-today">
                                <span className="weather-today-value">21&#8451;</span>
                               {/* <img src="assets/layout/images/dashboard/weather-icon-2.svg" width="60" alt="weather2"/>*/}
                            </div>

                            <ul className="weekly-weather">
                                <li>
                                    Thursday
                                    {/*<img src="assets/layout/images/dashboard/weather-icon-1.svg" alt="weather1"/>*/}
                                    <span className="weekly-weather-value">24</span>
                                </li>
                                <li>
                                    Friday
                                   {/* <img src="assets/layout/images/dashboard/weather-icon-3.svg" alt="weather3"/>*/}
                                    <span className="weekly-weather-value">19</span>
                                </li>
                                <li>
                                    Saturday
                                   {/* <img src="assets/layout/images/dashboard/weather-icon-4.svg" alt="weather4"/>*/}
                                    <span className="weekly-weather-value">15</span>
                                </li>
                                <li>
                                    Sunday
                                   {/* <img src="assets/layout/images/dashboard/weather-icon-1.svg" alt="weather1"/>*/}
                                    <span className="weekly-weather-value">24</span>
                                </li>
                                <li>
                                    Monday
                                    {/*<img src="assets/layout/images/dashboard/weather-icon-2.svg" alt="weather2"/>*/}
                                    <span className="weekly-weather-value">21</span>
                                </li>
                                <li>
                                    Tuesday
                                    {/*<img src="assets/layout/images/dashboard/weather-icon-3.svg" alt="weather3"/>*/}
                                    <span className="weekly-weather-value">20</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </ScrollPanel>

            </div>
        );
    }
}
