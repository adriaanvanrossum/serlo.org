/*

This is a copy of src/next/client/index.tsx

Modified to support multi roots

To use it, please transpile it with Babel (https://babeljs.io/repl/)

(eventually adding babel-plugin-syntax-jsx and plugin-syntax-typescript)

and copy output to index.js

*/

/* global location */
import React from 'react'
import ReactDOM from 'react-dom'
import { createRouter, makePublicRouterInstance } from 'next/router'
import { parse as parseQs, stringify as stringifyQs } from 'querystring'

// ----------------- MODIFICATION 1 --------------------

// Original:

// import HeadManager from './head-manager'
// import mitt from '../next-server/lib/mitt'
// import {
//   loadGetInitialProps,
//   getURL,
//   SUPPORTS_PERFORMANCE_USER_TIMING
// } from '../next-server/lib/utils'
// import PageLoader from './page-loader'
// import * as envConfig from '../next-server/lib/runtime-config'
// import { HeadManagerContext } from '../next-server/lib/head-manager-context'
// import { DataManagerContext } from '../next-server/lib/data-manager-context'
// import { RouterContext } from '../next-server/lib/router-context'
// import { DataManager } from '../next-server/lib/data-manager'
// import { isDynamicRoute } from '../next-server/lib/router/utils/is-dynamic'

// New:

import HeadManager from 'next/dist/client/head-manager'
import mitt from 'next/dist/next-server/lib/mitt'
import {
  loadGetInitialProps,
  getURL,
  SUPPORTS_PERFORMANCE_USER_TIMING
} from 'next/dist/next-server/lib/utils'
import PageLoader from 'next/dist/client/page-loader'
import * as envConfig from 'next/dist/next-server/lib/runtime-config'
import { HeadManagerContext } from 'next/dist/next-server/lib/head-manager-context'
import { DataManagerContext } from 'next/dist/next-server/lib/data-manager-context'
import { RouterContext } from 'next/dist/next-server/lib/router-context'
import { DataManager } from 'next/dist/next-server/lib/data-manager'
import { isDynamicRoute } from 'next/dist/next-server/lib/router/utils/is-dynamic'

// Reason:

// Adapting paths to the correct context, because this file is loaded
// from module root and not from within a certain folder

// ----------------- END MODIFICATION 1 --------------------

// Polyfill Promise globally
// This is needed because Webpack's dynamic loading(common chunks) code
// depends on Promise.
// So, we need to polyfill it.
// See: https://webpack.js.org/guides/code-splitting/#dynamic-imports
if (!window.Promise) {
  window.Promise = Promise
}

// ----------------- MODIFICATION 2 --------------------

// Original:

// const data = JSON.parse(document.getElementById('__NEXT_DATA__').textContent)

// New:

const data = JSON.parse(
  document.getElementById(
    '__NEXT_DATA__' + (window.NEXT_ROOTS ? window.NEXT_ROOTS[0] : '')
  ).textContent
)

// Reason:

// We have some global settings which are shared across all elements.
// These settings are loaded from the first data tag.

// ----------------- END MODIFICATION 2 --------------------

window.__NEXT_DATA__ = data

export const version = process.env.__NEXT_VERSION

const {
  props,
  err,
  page,
  query,
  buildId,
  assetPrefix,
  runtimeConfig,
  dynamicIds
} = data

const d = JSON.parse(window.__NEXT_DATA__.dataManager)
export const dataManager = new DataManager(d)

// ----------------- MODIFICATION 7 --------------------

// Original:

// const prefix = assetPrefix || ''

// New:

const prefix = props.pageProps.nextAssetPrefix || ''

// Reason:

// Loading the right prefix from server

// ----------------- END MODIFICATION 7 --------------------

// With dynamic assetPrefix it's no longer possible to set assetPrefix at the build time
// So, this is how we do it in the client side at runtime
__webpack_public_path__ = `${prefix}/_next/` //eslint-disable-line
// Initialize next/config with the environment configuration
envConfig.setConfig({
  serverRuntimeConfig: {},
  publicRuntimeConfig: runtimeConfig || {}
})

const asPath = getURL()

const pageLoader = new PageLoader(buildId, prefix)
const register = ([r, f]) => pageLoader.registerPage(r, f)
if (window.__NEXT_P) {
  window.__NEXT_P.map(register)
}
window.__NEXT_P = []
window.__NEXT_P.push = register

const headManager = new HeadManager()
const appElement = document.getElementById('__next')

let lastAppProps
let webpackHMR
export let router
export let ErrorComponent
let Component
let App, onPerfEntry

class Container extends React.Component {
  componentDidCatch(err, info) {
    this.props.fn(err, info)
  }

  componentDidMount() {
    this.scrollToHash()

    // If page was exported and has a querystring
    // If it's a dynamic route or has a querystring
    if (
      data.nextExport &&
      (isDynamicRoute(router.pathname) || location.search || data.skeleton)
    ) {
      // update query on mount for exported pages
      router.replace(
        router.pathname +
          '?' +
          stringifyQs({
            ...router.query,
            ...parseQs(location.search.substr(1))
          }),
        asPath,
        {
          // WARNING: `_h` is an internal option for handing Next.js
          // client-side hydration. Your app should _never_ use this property.
          // It may change at any time without notice.
          _h: 1
        }
      )
    }
  }

  componentDidUpdate() {
    this.scrollToHash()
  }

  scrollToHash() {
    let { hash } = location
    hash = hash && hash.substring(1)
    if (!hash) return

    const el = document.getElementById(hash)
    if (!el) return

    // If we call scrollIntoView() in here without a setTimeout
    // it won't scroll properly.
    setTimeout(() => el.scrollIntoView(), 0)
  }

  render() {
    return this.props.children
  }
}

export const emitter = mitt()

export default async function nextjsEntrypoint({
  webpackHMR: passedWebpackHMR
} = {}) {
  window.__NEXT_ENTRY_ = nextjsEntrypoint
  console.log('## NEXTJS Hydration ##')
  // This makes sure this specific lines are removed in production
  if (process.env.NODE_ENV === 'development') {
    webpackHMR = passedWebpackHMR
  }
  const { page: app, mod } = await pageLoader.loadPageScript('/_app')
  App = app
  if (mod && mod.unstable_onPerformanceData) {
    onPerfEntry = function({ name, startTime, value }) {
      mod.unstable_onPerformanceData({ name, startTime, value })
    }
  }

  let initialErr = err

  // ----------------- MODIFICATION 3 --------------------

  // New:

  let components = {}

  // Reason:

  // Saving multiple pages

  // ----------------- END MODIFICATION 3 --------------------

  try {
    // ----------------- MODIFICATION 4 --------------------

    // Original:

    // Component = await pageLoader.loadPage(page)

    // New:

    if (!window.NEXT_ROOTS) {
      Component = await pageLoader.loadPage(page)
    } else {
      for (let id of window.NEXT_ROOTS) {
        const indexOfHashtag = id.indexOf('#')
        const pageId = id.substring(0, indexOfHashtag)
        let component = await pageLoader.loadPage(pageId)
        components[id] = component
        if (!Component) Component = component
      }
    }

    // Reason:

    // Loading every single page for each root

    // ----------------- END MODIFICATION 4 --------------------

    if (process.env.NODE_ENV !== 'production') {
      const { isValidElementType } = require('react-is')
      if (!isValidElementType(Component)) {
        throw new Error(
          `The default export is not a React Component in page: "${page}"`
        )
      }
    }
  } catch (error) {
    // This catches errors like throwing in the top level of a module
    initialErr = error
  }

  if (window.__NEXT_PRELOADREADY) {
    await window.__NEXT_PRELOADREADY(dynamicIds)
  }

  router = createRouter(page, query, asPath, {
    initialProps: props,
    pageLoader,
    App,
    Component,
    wrapApp,
    err: initialErr,
    subscription: ({ Component, props, err }, App) => {
      render({ App, Component, props, err, emitter })
    }
  })

  // ----------------- MODIFICATION 5 --------------------

  // Original:

  // const renderCtx = { App, Component, props, err: initialErr, emitter }
  // render(renderCtx)

  // New:

  if (!window.NEXT_ROOTS) {
    const renderCtx = { App, Component, props, err: initialErr, emitter }
    render(renderCtx)
  } else {
    for (let page in components) {
      let pageProps = JSON.parse(
        document.getElementById('__NEXT_DATA__' + page).textContent
      ).props
      const renderCtx = {
        App,
        page,
        Component: components[page],
        props: pageProps,
        err: initialErr,
        emitter,
        domEl: document.getElementById('__next' + page)
      }
      render(renderCtx)
    }
  }

  // Reason:

  // Now render every page within its own root div.

  // ----------------- END MODIFICATION 5 --------------------

  return emitter
}

export async function render(props) {
  if (props.err) {
    await renderError(props)
    return
  }

  try {
    await doRender(props)
  } catch (err) {
    await renderError({ ...props, err })
  }
}

// This method handles all runtime and debug errors.
// 404 and 500 errors are special kind of errors
// and they are still handle via the main render method.
export async function renderError(props) {
  const { App, err } = props

  // In development runtime errors are caught by react-error-overlay
  // In production we catch runtime errors using componentDidCatch which will trigger renderError
  if (process.env.NODE_ENV !== 'production') {
    return webpackHMR.reportRuntimeError(webpackHMR.prepareError(err))
  }

  // Make sure we log the error to the console, otherwise users can't track down issues.
  console.error(err)

  ErrorComponent = await pageLoader.loadPage('/_error')

  // In production we do a normal render with the `ErrorComponent` as component.
  // If we've gotten here upon initial render, we can use the props from the server.
  // Otherwise, we need to call `getInitialProps` on `App` before mounting.
  const AppTree = wrapApp(App)
  const appCtx = {
    Component: ErrorComponent,
    AppTree,
    router,
    ctx: { err, pathname: page, query, asPath, AppTree }
  }

  const initProps = props.props
    ? props.props
    : await loadGetInitialProps(App, appCtx)

  await doRender({ ...props, err, Component: ErrorComponent, props: initProps })
}

// If hydrate does not exist, eg in preact.
let isInitialRender = typeof ReactDOM.hydrate === 'function'
function renderReactElement(reactEl, domEl) {
  // mark start of hydrate/render
  if (SUPPORTS_PERFORMANCE_USER_TIMING) {
    performance.mark('beforeRender')
  }

  // The check for `.hydrate` is there to support React alternatives like preact
  if (isInitialRender) {
    ReactDOM.hydrate(reactEl, domEl, markHydrateComplete)
    isInitialRender = false
  } else {
    ReactDOM.render(reactEl, domEl, markRenderComplete)
  }

  if (onPerfEntry) {
    performance.getEntriesByType('paint').forEach(onPerfEntry)
  }
}

function markHydrateComplete() {
  if (!SUPPORTS_PERFORMANCE_USER_TIMING) return

  performance.mark('afterHydrate') // mark end of hydration

  performance.measure(
    'Next.js-before-hydration',
    'navigationStart',
    'beforeRender'
  )
  performance.measure('Next.js-hydration', 'beforeRender', 'afterHydrate')
  if (onPerfEntry) {
    performance.getEntriesByName('Next.js-hydration').forEach(onPerfEntry)
    performance.getEntriesByName('beforeRender').forEach(onPerfEntry)
  }
  clearMarks()
}

function markRenderComplete() {
  if (!SUPPORTS_PERFORMANCE_USER_TIMING) return

  performance.mark('afterRender') // mark end of render
  const navStartEntries = performance.getEntriesByName('routeChange', 'mark')

  if (!navStartEntries.length) {
    return
  }

  performance.measure(
    'Next.js-route-change-to-render',
    navStartEntries[0].name,
    'beforeRender'
  )
  performance.measure('Next.js-render', 'beforeRender', 'afterRender')
  if (onPerfEntry) {
    performance.getEntriesByName('Next.js-render').forEach(onPerfEntry)
    performance
      .getEntriesByName('Next.js-route-change-to-render')
      .forEach(onPerfEntry)
  }
  clearMarks()
}

function clearMarks() {
  ;[
    'beforeRender',
    'afterHydrate',
    'afterRender',
    'routeChange'
  ].forEach(mark => performance.clearMarks(mark))
  ;[
    'Next.js-before-hydration',
    'Next.js-hydration',
    'Next.js-route-change-to-render',
    'Next.js-render'
  ].forEach(measure => performance.clearMeasures(measure))
}

function AppContainer({ children }) {
  return (
    <Container
      fn={error =>
        renderError({ App, err: error }).catch(err =>
          console.error('Error rendering page: ', err)
        )
      }
    >
      <RouterContext.Provider value={makePublicRouterInstance(router)}>
        <DataManagerContext.Provider value={dataManager}>
          <HeadManagerContext.Provider value={headManager.updateHead}>
            {children}
          </HeadManagerContext.Provider>
        </DataManagerContext.Provider>
      </RouterContext.Provider>
    </Container>
  )
}

const wrapApp = App => props => {
  const appProps = { ...props, Component, err, router }
  return (
    <AppContainer>
      <App {...appProps} />
    </AppContainer>
  )
}

async function doRender({ App, Component, props, err, domEl }) {
  // Usual getInitialProps fetching is handled in next/router
  // this is for when ErrorComponent gets replaced by Component by HMR
  if (
    !props &&
    Component &&
    Component !== ErrorComponent &&
    lastAppProps.Component === ErrorComponent
  ) {
    const { pathname, query, asPath } = router
    const AppTree = wrapApp(App)
    const appCtx = {
      router,
      AppTree,
      Component: ErrorComponent,
      ctx: { err, pathname, query, asPath, AppTree }
    }
    props = await loadGetInitialProps(App, appCtx)
  }

  Component = Component || lastAppProps.Component
  props = props || lastAppProps.props

  const appProps = { ...props, Component, err, router }
  // lastAppProps has to be set before ReactDom.render to account for ReactDom throwing an error.
  lastAppProps = appProps

  emitter.emit('before-reactdom-render', {
    Component,
    ErrorComponent,
    appProps
  })

  // We catch runtime errors using componentDidCatch which will trigger renderError

  renderReactElement(
    <AppContainer>
      <App {...appProps} />
    </AppContainer>,
    // ----------------- MODIFICATION 6 --------------------

    // Original:

    // appElement

    // New:

    domEl ? domEl : appElement

    // Reason: Render into separate dom element

    // ----------------- END MODIFICATION 6 --------------------
  )

  emitter.emit('after-reactdom-render', { Component, ErrorComponent, appProps })
}
