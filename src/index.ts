import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { getUrl, saveCode } from './db.js'

const app = new Hono()
const url = getUrl("111")?.url || "";
app.get('/', (c) => c.text("Page"));
app.get('/link', (c) => c.text(getUrl(c.req.query('id') ?? "")?.url ?? ""));
serve({
    fetch: app.fetch,
    port: 3000,
});
app.get('/shortlink', (c) => { 
    const id = crypto.randomUUID();
    const newLink = "http://localhost:3000/link?id="+id;
    const url = c.req.query("url") || "";
    saveCode(id, url);

    return c.text(newLink);
})