import Database, { type Statement, type Database as DbType } from "better-sqlite3"

const database: DbType = new Database("./storage.db");

database.exec(`
CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    url TEXT NOT NULL,
    custom_text TEXT,
    combined_code TEXT GENERATED ALWAYS AS (custom_text || code) STORED UNIQUE,
    clicks INTEGER NOT NULL DEFAULT 0,
    last_click DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'active' check(status IN ('active', 'inactive'))
);

CREATE TABLE IF NOT EXISTS clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url_id INTEGER NOT NULL,
    click_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (url_id) REFERENCES urls(id)
);
`)
//tasdasdas
export interface UrlRecord {
    id: number;
    code: string;
    url: string;
    combined_code: string;
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
    UPDATE urls
    SET clicks = clicks + 1,
        last_click = CURRENT_TIMESTAMP
    WHERE combined_code = ?
    RETURNING *    
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

export function saveRandom(code: string, url: string) {
    saveRandomStmt.run(code, url);
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


