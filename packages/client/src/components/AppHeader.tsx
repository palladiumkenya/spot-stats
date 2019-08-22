import React from "react";
import {Component} from "react";
import classNames from 'classnames';
import {InputText} from "primereact/inputtext";

interface Props {
    onMenuButtonClick?: any,
    onTopbarMenuButtonClick?: any,
    onTopbarItemClick?: any,
    profileMode?: string,
    horizontal?: boolean,
    topbarMenuActive?: boolean,
    activeTopbarItem?: string,
    onRightPanelButtonClick?: any
}

interface State {
}

export class AppHeader extends Component<Props, State> {

    onTopbarItemClick = (event: any, item: any) => {
        if (this.props.onTopbarItemClick) {
            this.props.onTopbarItemClick({
                originalEvent: event,
                item: item
            });
        }
    };

    render() {

        let topbarItemsClassName = classNames('topbar-items animated fadeInDown', {'topbar-items-visible': this.props.topbarMenuActive});

        return (
            <div className="topbar clearfix">
                <div className="topbar-left">
                    <div className="logo"></div>
                </div>

                <div className="topbar-right">
                    <a id="menu-button" onClick={this.props.onMenuButtonClick}>
                        <i></i>
                    </a>

                    <ul className={topbarItemsClassName}>
                        <li className={classNames({'active-top-menu': this.props.activeTopbarItem === 'settings'})}>
                            <a onClick={(e) => this.onTopbarItemClick(e, 'settings')}>
                                <i className="topbar-icon material-icons">settings</i>
                                <span className="topbar-item-name">Settings</span>
                            </a>
                            <ul className="ultima-menu animated fadeInDown">
                                <li role="menuitem">
                                    <a>
                                        <i className="material-icons">palette</i>
                                        <span>Configs</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                      </ul>
                </div>
            </div>
        );
    }
}
