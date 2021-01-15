import App from 'next/app'
import Layout from '../components/Layout'
import { Provider } from 'react-redux'
import withRedux from '../lib/with-redux'
import Router from 'next/router'
import 'antd/dist/antd.css' 
import Loading from '../components/Loading'
import axios from 'axios'


class myApp extends App {

	state = {
		loading: false
	}

	startLoading = () => {
		this.setState({
			loading: true
		})
	}

	stopLoading = () => {
		this.setState({
			loading: false
		})
	}
	
	// life-cycle function
	componentDidMount() {
		Router.events.on('routerChangeStart', this.startLoading)
		Router.events.on('routerChangeComplete', this.stopLoading)
		Router.events.on('routerChangeError', this.stopLoading)

		axios.get('/github/search/repositories?q=react').then(resp => console.log(resp))
	
	}

	componentWillUnmount() {
		Router.events.off('routerChangeStart', this.startLoading)
		Router.events.off('routerChangeComplete', this.stopLoading)
		Router.events.off('routerChangeError', this.stopLoading)

	}


	static async getInitialProps(ctx) {

		const { Component } = ctx
		// console.log(Component)
		
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
			{ this.state.loading ? <Loading></Loading> : null }
				<Layout>
					<Component { ...pageProps }>
					</Component>
				</Layout>
			</Provider>
		)
	}
}

export default withRedux(myApp)
