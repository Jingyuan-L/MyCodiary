import React from 'react'
import createStore from '../store/store'

const isServer = typeof window === 'undefined' // 判断是否是服务端
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

// once render, return to a new store
function getOrCreateStore(initialState) {
	// if server, create new cache
	if (isServer) {
		return createStore(initialState)
	}

	// cache for client
	if (!window[__NEXT_REDUX_STORE__]) {
		window[__NEXT_REDUX_STORE__] = createStore(initialState)
	}
	return window[__NEXT_REDUX_STORE__]
}

const withRedux = (Comp) => {
	class WithReduxApp extends React.Component {
		constructor(props) {
			super(props)
			this.reduxStore = getOrCreateStore(props.initialReduxState)
		}

		render() {
			const { Component, pageProps, ...rest } = this.props
			// console.log('TCL: HOC', Component, pageProps)
			if (pageProps) {
				pageProps.test = 'test'
			}

			return (
				<Comp
					reduxStore={this.reduxStore}
					{...rest}
					Component={Component}
					pageProps={pageProps}
				/>
			)
		}
	}

	// TestHocComp.getInitialProps = Comp.getInitialProps
	WithReduxApp.getInitialProps = async (ctx) => {
		// console.log('TCL: WithReduxApp.getInitialProps -> ctx', ctx)
		let reduxStore
		// console.log('isServer', isServer)
		if (isServer) {
			const { req } = ctx.ctx
			const session = req.session
			if (session && session.userInfo) {
				reduxStore = getOrCreateStore({
					user: session.userInfo,
				})
			} else {
				reduxStore = getOrCreateStore()
			}
		} else {
			reduxStore = getOrCreateStore()
		}
		// console.log(reduxStore)
		ctx.reduxStore = reduxStore

		let pageProps = {}
		if (typeof Comp.getInitialProps === 'function') {
			pageProps = await Comp.getInitialProps(ctx)
		}

		return {
			...pageProps,
			initialReduxState: reduxStore.getState(),
		}
	}

	return WithReduxApp
}

export default withRedux