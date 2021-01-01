const withCss = require('@zeit/next-css')
const config = require('./config')

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'

module.exports = withCss({
    publicRuntimeConfig: {
        GITHUB_OAUTH_URL,
        OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${
            config.github.client_id
        }&scope=${SCOPE}`,
    },
})

