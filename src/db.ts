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
    click_date DATE NOT NULL DEFAULT CURRENT_DATE,
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

function generateGetClicksPerUserPerUrlStmt(aliasList: string[]): Statement {
    const aliasString = aliasList.map(() => '?').join(",");
    const string = `SELECT u.ident, c.click_date, COUNT(c.id) as click_count
    FROM urls u
    LEFT JOIN clicks c ON u.id = c.url_id
    WHERE u.ident IN (${aliasString})
    GROUP BY u.ident, c.click_date`;
    console.log(string);
    return database.prepare(string);
}

export function getUrls(aliasList: string[]): UrlRecord[] {
    return getUrlsStmt.all(aliasList.join(',')) as UrlRecord[];
}

export function saveRandom(code: string, url: string) {
    saveRandomStmt.run(code, url);
}


export function getClicksPerDatePerUrl(aliasList: string[]): Record<string, Record<string, number>> {
    const stmt = generateGetClicksPerUserPerUrlStmt(aliasList);
    const clickData = stmt.all(aliasList) as { ident: string, click_date: string, click_count: number }[];
    console.log(clickData);
    const groupedByUrl = Object.groupBy(clickData, (data) => data.ident);
    let output: Record<string, Record<string, number>> = {};
    for (const [ident, clicks] of Object.entries(groupedByUrl)) {
        output[ident] = Object.fromEntries(clicks?.map(click => [click.click_date, click.click_count]) || []);
    }
    return output;
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


