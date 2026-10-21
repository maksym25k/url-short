import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { getUrl } from './db.js'

const app = new Hono()
const url = getUrl("111")?.url || "";
app.get('/', (c) => c.text(url));

serve({
    fetch: app.fetch,
    port: 3000,
});