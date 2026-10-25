import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { validUrl } from './utils.js'
import { saveUrlCustom, saveUrlRandom } from './logic.js'
import { getUrl } from './db.js'
import fs from 'fs'
import process, { env } from 'process'

const app = new Hono();

const baseUrl = env.BASE_URL || "http://localhost";
const baseIp = env.BASE_IP || "localhost";
const port = Number(env.PORT) || 3000;

const indexHtml = fs.readFileSync("./public/index.html", "utf-8");

app.get('/', (c) => c.html(indexHtml));

app.get('/link', (c) => {
    const url = getUrl(c.req.query('alias') ?? "")?.url;
    if(!url) {
        return c.json({ error: "There was no url found for this alias"}, 400);
    } 
    return c.redirect(url, 302);
});

app.get('/shortlink', (c) => {
    const url = c.req.query("url")?.replace(/\s/g, '') || "";
    const customText = c.req.query("custom")?.replace(/\s/g, '') || "";
    
    if (!validUrl(url)) return c.json({ error: "Please insert valid url" }, 400);
    if (customText.match(/[^a-zA-Z0-9_-]/)) 
        return c.json({ error: "Custom text can only contain letters, numbers, underscores and dashes" }, 400);
    
    let code = "";
    if(customText !== "") {
        try {
            saveUrlCustom(url, customText);
        } catch (err: any) {
            if(err.message === "The custom alias is already taken"){
                return c.json({ error: "The custom link alias is already taken" }, 400);
            } else {
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    } else {
        try{
            code = saveUrlRandom(url);
        } catch (err: any) {
            return c.json({ error: "Internal server error" }, 500);
        }
    }
    
    const newurl = baseIp + ":" + port + "/link?alias=" + customText + code;
    return c.json({ shortUrl: newurl });
});

serve({
    fetch: app.fetch,
    port: port,
    hostname: baseIp,
}, (info) => {
    console.log('Server started ' + baseUrl + ':' + port + ' at ' + new Date().toLocaleString());
});