import React from "react";
import {Component} from "react";
import {AppSubMenu} from "./AppSubMenu";

interface Props {
    model: any,
    onMenuItemClick: any,
    onRootMenuItemClick: any,
    layoutMode: any,
    active: boolean
}

interface State {
}

export class AppMenu extends Component<Props, State> {
    render() {
        return (
            <AppSubMenu items={this.props.model} className="ultima-menu ultima-main-menu clearfix"
                        menuActive={this.props.active} onRootItemClick={this.props.onRootMenuItemClick}
                        onMenuItemClick={this.props.onMenuItemClick} root={true} layoutMode={this.props.layoutMode}/>
        );
    }
}
