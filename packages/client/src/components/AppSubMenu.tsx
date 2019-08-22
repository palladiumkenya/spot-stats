import React from "react";
import {Component} from "react";
import classNames from "classnames";

interface Props {
    className?: any,
    items?: any,
    layoutMode?: any,
    menuActive?: boolean,
    onMenuItemClick?: any,
    onRootItemClick?: any,
    root?: boolean
}

interface State {
    activeIndex: number
}

export class AppSubMenu extends Component<Props, State> {


    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            activeIndex: 0
        };
    }

    onMenuItemClick = (event: any, item: any, index: any) => {
        //avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        if (this.props.root && this.props.onRootItemClick) {
            this.props.onRootItemClick({
                item: item,
                originalEvent: event
            });
        }

        //execute command
        if (item.command) {
            item.command({originalEvent: event, item: item});
        }

        //prevent hash change
        if (item.items || !item.url) {
            event.preventDefault();
        }

        if (index === this.state.activeIndex)
            this.setState({activeIndex: 0});
        else
            this.setState({activeIndex: index});

        if (this.props.onMenuItemClick) {
            this.props.onMenuItemClick({
                originalEvent: event,
                item: item
            });
        }
    };

    onMenuItemMouseEnter = (index: any) => {
        if (this.props.root && this.props.menuActive && this.isHorizontalOrSlim()) {
            this.setState({activeIndex: index});
        }
    };

    componentDidUpdate = (prevProps: Props, prevState: State) => {
        if (this.isHorizontalOrSlim() && prevProps.menuActive && !this.props.menuActive) {
            this.setState({activeIndex: 0});
        }
    };

    isHorizontalOrSlim = () => (this.props.layoutMode === 'horizontal' || this.props.layoutMode === 'slim');

    render() {
        const items = this.props.items && this.props.items.map((item: any, i: any) => {
            let active = this.state.activeIndex === i;
            let styleClass = classNames(item.badgeStyleClass, {'active-menuitem': active});
            let badge = item.badge && <span className="menuitem-badge">{item.badge}</span>;
            let submenuIcon = item.items && <i className="material-icons submenu-icon">keyboard_arrow_down</i>;
            let tooltip = this.props.root && <div className="layout-menu-tooltip">
                <div className="layout-menu-tooltip-arrow"></div>
                <div className="layout-menu-tooltip-text">{item.label}</div>
            </div>;

            return <li className={styleClass} key={i}>
                <a className="ripplelink" href={item.url || '#'} onClick={(e) => this.onMenuItemClick(e, item, i)}
                   target={item.target}
                   onMouseEnter={(e) => this.onMenuItemMouseEnter(i)}>
                    <i className="material-icons">{item.icon}</i>
                    <span>{item.label}</span>
                    {badge}
                    {submenuIcon}
                </a>
                {tooltip}
                <AppSubMenu items={item.items} onMenuItemClick={this.props.onMenuItemClick}
                            layoutMode={this.props.layoutMode}
                            menuActive={this.props.menuActive}/>
            </li>
        });

        return <ul className={this.props.className}>{items}</ul>;
    }
}
