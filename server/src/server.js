import cookieParser from 'cookie-parser'
import express from 'express'
import { corsOptions } from './configs/cors'
import { env } from './configs/environment'
import CONNECT_DB from './configs/mongodb'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddlewares'
import { APIs_V1 } from './routes/v1'
import { checkOverload } from './helpers/check.connect'
var cors = require('cors')

const http = require('http')

const START_SERVER = () => {
  const app = express()

  app.use((req, res, next) => {
    res.set('Cache-Control', ' no-store')
    next()
  })

  app.use(cookieParser())

  const hostname = env.BUILD_MODE === 'production' ? '0.0.0.0' : 'localhost'
  const port = env.APP_POST

  app.use(cors(corsOptions))

  app.use(express.json())

  app.use('/api/v1', APIs_V1)

  //middleware error handling
  app.use(errorHandlingMiddleware)

  const server = http.createServer(app)

  server.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello ${env.AUTHOR}, I am running at http://${hostname}:${port}/`)
  })
}

CONNECT_DB().then(() => {
  START_SERVER();

  //check overload every 5 seconds when in production
  env.BUILD_MODE === 'production' && checkOverload();
})


