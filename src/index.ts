import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { getUrl, saveCode } from './db.js'
import { validUrl } from './helper.js'
import { nanoid } from "nanoid"

const app = new Hono();

app.get('/', (c) => c.text("Page"));

app.get('/link', (c) => c.text(getUrl(c.req.query('id') ?? "")?.url ?? ""));

app.get('/shortlink', (c) => {
    const url = c.req.query("url") || "";
    if(!validUrl(url)) return c.json({ error: "Please insert valid url" }, 404);
    let saved = false;
    let id;
    do {
        id = nanoid(8);
        saved = saveCode(id, url);
    } while(!saved);
    
    const newurl = "localhost:3000/link?id=" + id;
    
    return c.text(newurl);
});

serve({
    fetch: app.fetch,
    port: 3000,
});