const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const session = require('koa-session')
const Redis = require('ioredis')
const auth = require('./server/auth')
const api = require('./server/api')

const RedisSessionStore = require('./server/session-store')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// creat redis client
const redis = new Redis()

app.prepare().then(() => {
    const server = new Koa()
    const router = new Router()

    server.keys = ['Jillian develop github app']
    const SESSION_CONFIG = {
        key: 'keyid',
        store: new RedisSessionStore(redis)
    }

    server.use(session(SESSION_CONFIG, server))

    auth(server)
    api(server)

    router.get('/api/user/info', async (ctx) => {
		const user = ctx.session.userInfo
		if (!user) {
			ctx.status = 402
			ctx.body = 'Need Login'
		} else {
			ctx.body = user
			ctx.set('Content-Type', 'application/json')
		}
    })
    
    server.use(router.routes())

    server.use(async (ctx, next) => {
        ctx.req.session = ctx.session
        // console.log('session is: ', ctx.session)
        await handle(ctx.req, ctx.res)
        ctx.respond = false
        
    })

    server.listen(3000, () => {
        console.log('koa server listening on port 3000')
    })
})