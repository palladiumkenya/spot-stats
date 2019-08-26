import React from "react";
import {Component} from "react";
import {AppMenu} from "../components/AppMenu";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    HashRouter
} from "react-router-dom";
import "./App.css";
import {DocketHome} from "./court/DocketHome";
import {ProfileHome} from "./transfers/ProfileHome";
import ProfileShowcase from "./transfers/ProfileShowcase";

interface Props {
    menuClick?: boolean;
    horizontal?: boolean;
}

interface State {
    layoutMode: string;
    profileMode: string;
    overlayMenuActive: boolean;
    staticMenuDesktopInactive: boolean;
    staticMenuMobileActive: boolean;
    rotateMenuButton: boolean;
    topbarMenuActive: boolean;
    activeTopbarItem: any;
    darkMenu: boolean;
    rightPanelActive: boolean;
    menuActive: boolean;
}

export class App extends Component<Props, State> {
    private menu: any;
    private topbarItemClick: boolean = false;
    private rightPanelClick: boolean = false;
    private menuClick: boolean = false;
    private layoutMenuScroller: any;
    private layoutContainer: any;

    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            layoutMode: "horizontal",
            profileMode: "inline",
            overlayMenuActive: false,
            staticMenuDesktopInactive: false,
            staticMenuMobileActive: false,
            rotateMenuButton: false,
            topbarMenuActive: false,
            activeTopbarItem: null,
            darkMenu: false,
            rightPanelActive: false,
            menuActive: false
        };
        this.createMenu();
    }

    onMenuClick = (event: any) => {
        this.menuClick = true;

        if (!this.isHorizontal()) {
            setTimeout(() => {
                this.layoutMenuScroller.moveBar();
            }, 500);
        }
    };

    onMenuButtonClick = (event: any) => {
        this.menuClick = true;
        this.setState({
            rotateMenuButton: !this.state.rotateMenuButton,
            topbarMenuActive: false
        });

        if (this.state.layoutMode === "overlay") {
            this.setState({
                overlayMenuActive: !this.state.overlayMenuActive
            });
        } else {
            if (this.isDesktop())
                this.setState({
                    staticMenuDesktopInactive: !this.state.staticMenuDesktopInactive
                });
            else
                this.setState({
                    staticMenuMobileActive: !this.state.staticMenuMobileActive
                });
        }

        event.preventDefault();
    };

    onTopbarMenuButtonClick = (event: any) => {
        this.topbarItemClick = true;
        this.setState({topbarMenuActive: !this.state.topbarMenuActive});
        this.hideOverlayMenu();
        event.preventDefault();
    };

    onTopbarItemClick = (event: any) => {
        this.topbarItemClick = true;

        if (this.state.activeTopbarItem === event.item)
            this.setState({activeTopbarItem: null});
        else this.setState({activeTopbarItem: event.item});

        event.originalEvent.preventDefault();
    };

    onMenuItemClick = (event: any) => {
        if (!event.item.items) {
            this.hideOverlayMenu();
        }
        if (!event.item.items && (this.isHorizontal() || this.isSlim())) {
            this.setState({
                menuActive: false
            });
        }
    };

    onRootMenuItemClick = (event: any) => {
        this.setState({
            menuActive: !this.state.menuActive
        });

        event.originalEvent.preventDefault();
    };

    onRightPanelButtonClick = (event: any) => {
        this.rightPanelClick = true;
        this.setState({
            rightPanelActive: !this.state.rightPanelActive
        });
        event.preventDefault();
    };

    onRightPanelClick = (event: any) => {
        this.rightPanelClick = true;
    };

    onDocumentClick = (event: any) => {
        if (!this.topbarItemClick) {
            this.setState({
                activeTopbarItem: null,
                topbarMenuActive: false
            });
        }

        if (!this.menuClick) {
            if (this.isHorizontal() || this.isSlim()) {
                this.setState({
                    menuActive: false
                });
            }

            this.hideOverlayMenu();
        }

        if (!this.rightPanelClick) {
            this.setState({
                rightPanelActive: false
            });
        }

        this.topbarItemClick = false;
        this.menuClick = false;
        this.rightPanelClick = false;
    };

    hideOverlayMenu = () => {
        this.setState({
            rotateMenuButton: false,
            overlayMenuActive: false,
            staticMenuMobileActive: false
        });
    };

    isTablet = () => {
        let width = window.innerWidth;
        return width <= 1024 && width > 640;
    };

    isDesktop = () => window.innerWidth > 1024;

    isMobile = () => window.innerWidth <= 640;

    isOverlay = () => this.state.layoutMode === "overlay";

    isHorizontal = () => this.state.layoutMode === "horizontal";

    isSlim = () => this.state.layoutMode === "slim";

    createMenu = () => {
        this.menu = [

            {
                label: "Uploads",
                icon: "cloud_upload",
                command: () => {
                    window.location.hash = "/stats";
                }
            },
            {
                label: "Dockets",
                icon: "build",
                command: () => {
                    window.location.hash = "/stats/dockets";
                }
            }
        ];
    };

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error(error, errorInfo)
    }

    render() {
        return (
            <div className="layout-wrapper" onClick={this.onDocumentClick}>
                <div
                    ref={el => (this.layoutContainer = el)}
                    className="layout-container menu-layout-horizontal"
                >
                    <div className="layout-menu" onClick={this.onMenuClick}>
                        <AppMenu
                            model={this.menu}
                            onMenuItemClick={this.onMenuItemClick}
                            onRootMenuItemClick={this.onRootMenuItemClick}
                            layoutMode={this.state.layoutMode}
                            active={this.state.menuActive}
                        />
                    </div>

                    <div className="layout-main">
                        <div className="layout-content">
                            <HashRouter>
                                <Switch>
                                    <Route exact path="/stats" component={ProfileHome}/>
                                    <Route path="/stats/dockets/" component={DocketHome}/>
                                    <Route path="/stats/showcase/:id" component={ProfileShowcase}/>
                                    <Route path="*" component={ProfileHome}/>
                                </Switch>
                            </HashRouter>
                        </div>
                    </div>
                    <div className="layout-mask"/>
                </div>
            </div>
        );
    }
}
