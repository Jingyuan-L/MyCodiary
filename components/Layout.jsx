import Link from 'next/link'
import { Input, Layout, Avatar, Tooltip, Dropdown, Menu } from 'antd'
import { GithubOutlined, UserOutlined } from '@ant-design/icons'
import { useState, useCallback } from 'react'
import { github } from '../config'
import Container from './Container'
import getConfig from 'next/config'
import { connect } from 'react-redux'

const { Header, Content, Footer } = Layout

const { publicRuntimeConfig } = getConfig()

function MyLayout ({ children, user }) {

    console.log(publicRuntimeConfig)
    console.log(user)

    const [search, setSearch] = useState('')

    const handleSearchChange = useCallback((event) => {
        setSearch(event.target.value)
    }, [setSearch])

    const handleOnSearch = useCallback(() => {}, [])

    const githubIconStyle = {
        color: 'white',
        fontSize: 40,
        display: 'block',
        paddingTop: 10,
        marginRight: 20,
    }

    const footerStyle = {
        textAlign: 'center',
    }
 
    const userDropDown = (
        <Menu>
            <Menu.Item>
                <a href="javascript:void(0)">
                    Logout
                </a>
            </Menu.Item>
        </Menu>
    )

    return (
        <Layout>
            <Header>
                <Container renderer={<div className="header-inner"></div>}>
                <div className="header-left">
                    <div className="logo">
                        <GithubOutlined style={githubIconStyle}/>
                    </div>
                    <div>
                        <Input.Search style={{ margin: 16 }}
                            placeholder="Search repositery" 
                            value={search}
                            onChange={handleSearchChange}
                            onSearch={handleOnSearch}
                        ></Input.Search>
                    </div>
                </div>
                <div className="header-right">
                    <div className="user">
                        { user && user.id ? (
                            <Dropdown overlay={userDropDown}>
                            <a href="/">
                                <Avatar size={40} src={user.avatar_url}></Avatar>
                            </a>
                            </Dropdown>
                        ) : (
                            <Tooltip title="Use GitHub to login.">
                            <a href={publicRuntimeConfig.OAUTH_URL}>
                                <Avatar size={40} icon={<UserOutlined />}></Avatar>
                            </a>
                            </Tooltip>
                        ) 
                        }
                    </div>
                </div>
                </Container>
            </Header>
            <Content>
                <Container>
                    { children }
                </Container>
            </Content>
            <Footer style={footerStyle} >
                Developed by Jillian @ <a href="https://github.com/Jingyuan-L">GitHub</a>
            </Footer>
            <style jsx>{`
                .header-inner {
                    display: flex;
                    justify-content: space-between;
                }
                .header-left {
                    display: flex;
                    justify-content: flex-start;
                }
            `}</style>
            <style jsx global>{`
                #__next {
                    height: 100%
                }
                .ant-layout {
                    height: 100%
                }
                .ant-layout-header {
                    padding-left: 0;
                    padding-right: 0;
                }
            `}</style>
        </Layout>
    )
}

export default connect(function mapState(state) {
    return {
        user: state.user,
    }
})(MyLayout)