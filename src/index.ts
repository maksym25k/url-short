import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { getUrl, saveCode } from './db.js'
import { validUrl } from './helper.js'
import { nanoid } from "nanoid"
import fs from 'fs'

const app = new Hono();

app.get('/', (c) =>c.html(fs.readFileSync("./public/index.html", "utf-8")));

app.get('/link', (c) => c.redirect(getUrl(c.req.query('id') ?? "")?.url ?? "", 302));

app.get('/shortlink', (c) => {
    const url = c.req.query("url") || "";
    const customText = c.req.query("custom") || "";
    if(!validUrl(url)) return c.json({ error: "Please insert valid url" }, 404);
    let saved = false;
    let id;
    do {
        id = nanoid(customText == "" || customText.length <= 2? 8 : 6);
        saved = saveCode(customText + id , url);
    } while(!saved);
    
    const newurl = "localhost:3000/link?id=" + customText + id;
    
    return c.json({ shortUrl: newurl });
});

serve({
    fetch: app.fetch,
    port: 3000,
});