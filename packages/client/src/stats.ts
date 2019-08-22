import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import {App} from "./containers/App";

const reactLifecycles = singleSpaReact({
    React,
    ReactDOM,
    rootComponent: App,
    domElementGetter,
})

export const bootstrap = [
    reactLifecycles.bootstrap,
]

export const mount = [
    reactLifecycles.mount,
]

export const unmount = [
    reactLifecycles.unmount,
]

function domElementGetter() {
    // Make sure there is a div for us to render into
    let el = document.getElementById('stats');
    if (!el) {
        el = document.createElement('div');
        el.id = 'stats';
        document.body.appendChild(el);
    }

    return el;
}
