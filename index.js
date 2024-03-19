import { env, exit } from 'node:process'
import express from 'express'
import NodeCache from 'node-cache'
import axios from 'axios'
import dotenv from 'dotenv'
import compression from 'compression'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'

dotenv.config()

const PORT = env.PORT || 3000
const API_KEY = env.API_KEY
const API_URL = env.API_URL

if (!API_KEY || !API_URL) {
  console.error('API_KEY and API_URL are required')
  exit(1)
}

const app = express()
const cache = new NodeCache({ stdTTL: 600 })

app.use(compression())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

app.get('/stock', async (req, res) => {
  const sku = req.query.sku

  if (!sku)
    res.status(400).json({ error: 'sku is required' })

  const cachedResponse = cache.get(sku)
  if (cachedResponse) {
    res.json(cachedResponse)
  }
  else {
    const { data } = await axios.get(API_URL, {
      headers: {
        Accept: '*/*',
        Authorization: `Basic ${API_KEY}`,
      },
      params: {
        sku,
      },
    })
    cache.set(sku, data)
    res.json(data)
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
