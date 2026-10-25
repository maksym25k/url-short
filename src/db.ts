import Database, { type Statement, type Database as DbType } from "better-sqlite3"

const database: DbType = new Database("./storage.db");

database.exec(`
CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    url TEXT NOT NULL,
    custom_text TEXT,
    ident TEXT GENERATED ALWAYS AS (custom_text || code) STORED UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'active' check(status IN ('active', 'inactive'))
);

CREATE TABLE IF NOT EXISTS clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url_id INTEGER NOT NULL,
    click_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    click_day DATE NOT NULL DEFAULT (date(click_time)),
    FOREIGN KEY (url_id) REFERENCES urls(id)
);
`)
//tasdasdas
export interface UrlRecord {
    id: number;
    code: string;
    url: string;
    ident: string;
    clicks: number,
    last_click: string;
    created_at: string;
}

export interface ClickRecord {
    id: number;
    url_id: number;
    click_time: string;
}

const saveRandomStmt: Statement = database.prepare(`
    INSERT INTO urls (code, url, custom_text)
    values (?, ?, '');
`);

const saveCustomStmt: Statement = database.prepare(`
    INSERT INTO urls (code, url, custom_text)
    values ('', ?, ?);
`);

const getUrlStmt: Statement = database.prepare(`
    SELECT * from urls
    WHERE ident = ?
`);

const addClickStmt: Statement = database.prepare(`
    INSERT INTO clicks (url_id)
    VALUES (?);
`);

const getUrlSilentStmt: Statement = database.prepare(`
    SELECT *
    FROM urls
    WHERE url = ? AND (custom_text = '' OR custom_text IS NULL)
`);

const getClicksStmt: Statement = database.prepare(`
    SELECT *
    FROM clicks
    WHERE url_id IN (?)
`);

const getUrlsStmt: Statement = database.prepare(`
    SELECT *
    FROM urls
    WHERE ident IN (?)
`);

export function getUrls(aliasList: string[]): UrlRecord[] {
    return getUrlsStmt.all(aliasList.join(',')) as UrlRecord[];
}

export function saveRandom(code: string, url: string) {
    saveRandomStmt.run(code, url);
}

export function getClicks(aliasList: string[]): {clicks: ClickRecord[], urls: UrlRecord[]} {
    const urls = getUrls(aliasList);
    const ids = urls.map(url => url.id);
    const clicks = getClicksStmt.all(ids.join(',')) as ClickRecord[];
    return { clicks, urls: urls };
}

export function saveCustom(custom_text: string, url: string) {
    saveCustomStmt.run(url, custom_text);
}

export function getUrl(code: string): UrlRecord | undefined {
    const urlRecord = getUrlStmt.get(code) as UrlRecord | undefined;
    urlRecord && addClickStmt.run(urlRecord.id);
    return urlRecord;
}

export function getUrlSilent(url: string): UrlRecord | undefined {
    return getUrlSilentStmt.get(url) as UrlRecord | undefined;
}


