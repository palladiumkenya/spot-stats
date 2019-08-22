import React from "react";
import {Component} from "react";
import {AppHeader} from "../components/AppHeader";
import {AppFooter} from "../components/AppFooter";
import classNames from "classnames";
import {AppRightPanel} from "../components/AppRightPanel";
import {AppMenu} from "../components/AppMenu";
import {ScrollPanel} from "primereact/scrollpanel";
import {AppInlineProfile} from "../components/AppInlineProfile";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import {DocketHome} from "./agency/DocketHome";

interface Props {
    menuClick?: boolean
    horizontal?: boolean
}

interface State {
    layoutMode: string,
    profileMode: string,
    overlayMenuActive: boolean,
    staticMenuDesktopInactive: boolean,
    staticMenuMobileActive: boolean,
    rotateMenuButton: boolean,
    topbarMenuActive: boolean,
    activeTopbarItem: any,
    darkMenu: boolean,
    rightPanelActive: boolean,
    menuActive: boolean
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
            layoutMode: 'static',
            profileMode: 'inline',
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
        this.setState(({
            rotateMenuButton: !this.state.rotateMenuButton,
            topbarMenuActive: false
        }));

        if (this.state.layoutMode === 'overlay') {
            this.setState({
                overlayMenuActive: !this.state.overlayMenuActive
            });
        } else {
            if (this.isDesktop())
                this.setState({staticMenuDesktopInactive: !this.state.staticMenuDesktopInactive});
            else
                this.setState({staticMenuMobileActive: !this.state.staticMenuMobileActive});
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
        else
            this.setState({activeTopbarItem: event.item});

        event.originalEvent.preventDefault();
    };

    onMenuItemClick = (event: any) => {
        if (!event.item.items) {
            this.hideOverlayMenu();
        }
        if (!event.item.items && (this.isHorizontal() || this.isSlim())) {
            this.setState({
                menuActive: false
            })
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
                })
            }

            this.hideOverlayMenu();
        }

        if (!this.rightPanelClick) {
            this.setState({
                rightPanelActive: false
            })
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
        })
    };

    isTablet = () => {
        let width = window.innerWidth;
        return width <= 1024 && width > 640;
    };

    isDesktop = () => window.innerWidth > 1024;

    isMobile = () => window.innerWidth <= 640;

    isOverlay = () => this.state.layoutMode === 'overlay';

    isHorizontal = () => this.state.layoutMode === 'horizontal';

    isSlim = () => this.state.layoutMode === 'slim';

    changeTheme = (theme: any) => {
        this.changeStyleSheetUrl('layout-css', theme, 'layout');
        this.changeStyleSheetUrl('theme-css', theme, 'theme');
    };

    changeStyleSheetUrl = (id: any, value: any, prefix: any) => {
        let element = document.getElementById(id);
        if (element) {
            let urlTokens = element.getAttribute('href')!.split('/');
            urlTokens[urlTokens.length - 1] = prefix + '-' + value + '.css';
            let newURL = urlTokens.join('/');
            element.setAttribute('href', newURL);
        }
    };

    createMenu = () => {
        this.menu = [
            {
                label: 'Partners', icon: 'dashboard', command: () => {
                    window.location.href = "/"
                }
            },
            {
                label: 'Facilities', icon: 'build', command: () => {
                    window.location.href = "/facility"
                }
            },
        ];
    };

    render() {
        const layoutContainerClassName = classNames('layout-container', {
            'menu-layout-static': this.state.layoutMode !== 'overlay',
            'menu-layout-overlay': this.state.layoutMode === 'overlay',
            'layout-menu-overlay-active': this.state.overlayMenuActive,
            'menu-layout-slim': this.state.layoutMode === 'slim',
            'menu-layout-horizontal': this.state.layoutMode === 'horizontal',
            'layout-menu-static-inactive': this.state.staticMenuDesktopInactive,
            'layout-menu-static-active': this.state.staticMenuMobileActive
        });
        const menuClassName = classNames('layout-menu', {'layout-menu-dark': this.state.darkMenu});

        return (
            <div className="layout-wrapper" onClick={this.onDocumentClick}>
                <div ref={(el) => this.layoutContainer = el} className={layoutContainerClassName}>
                    <AppHeader profileMode={this.state.profileMode} horizontal={this.props.horizontal}
                               topbarMenuActive={this.state.topbarMenuActive}
                               activeTopbarItem={this.state.activeTopbarItem}
                               onMenuButtonClick={this.onMenuButtonClick}
                               onTopbarMenuButtonClick={this.onTopbarMenuButtonClick}
                               onTopbarItemClick={this.onTopbarItemClick}
                               onRightPanelButtonClick={this.onRightPanelButtonClick}/>

                    <div className={menuClassName} onClick={this.onMenuClick}>
                        <ScrollPanel ref={(el) => this.layoutMenuScroller = el} style={{height: '100%'}}>
                            <div className="menu-scroll-content">
                                {(this.state.profileMode === 'inline' && this.state.layoutMode !== 'horizontal') &&
                                <AppInlineProfile/>}
                                <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick}
                                         onRootMenuItemClick={this.onRootMenuItemClick}
                                         layoutMode={this.state.layoutMode} active={this.state.menuActive}/>
                            </div>
                        </ScrollPanel>
                    </div>

                    <div className="layout-main">

                        {/* <AppBreadCrumbWithRouter />      */}

                        <div className="layout-content">
                            <Router>
                                <Route path="/" exact component={DocketHome}/>

                                {/*
                            <Route path="/forms" component={FormsDemo} />
                            <Route path="/sample" component={SampleDemo} />
                            <Route path="/data" component={DataDemo} />
                            <Route path="/panels" component={PanelsDemo} />
                            <Route path="/overlays" component={OverlaysDemo} />
                            <Route path="/menus" component={MenusDemo} />
                            <Route path="/messages" component={MessagesDemo} />
                            <Route path="/charts" component={ChartsDemo} />
                            <Route path="/misc" component={MiscDemo} />
                            <Route path="/empty" component={EmptyPage} />
                            <Route path="/utils" component={UtilsDemo} />
                            <Route path="/documentation" component={Documentation} /> */}

                            </Router>
                        </div>
                    </div>

                    <AppRightPanel expanded={this.state.rightPanelActive} onContentClick={this.onRightPanelClick}/>

                    <div className="layout-mask"></div>
                </div>
            </div>
        );
    }
}
