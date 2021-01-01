import App from 'next/app'
import Layout from '../components/Layout'
import { Provider } from 'react-redux'
import withRedux from '../lib/with-redux'
import Router from 'next/router'
import 'antd/dist/antd.css' 


class myApp extends App {
	
	static async getInitialProps(ctx) {

		const { Component } = ctx
		console.log(Component)
		
		let pageProps
		
		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx)
		}

		return { pageProps }
	}

	render() {
		const { Component, pageProps, reduxStore } = this.props // Component对应的是页面

		return (
			<Provider store={reduxStore}>
				<Layout>
					<Component { ...pageProps }></Component>
				</Layout>
			</Provider>
		)
	}
}

export default withRedux(myApp)
