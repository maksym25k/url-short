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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

const saveRandomStmt: Statement = database.prepare(`
    INSERT INTO urls (code, url, custom_text)
    values (?, ?, '') 
    RETURNING *
`);

const saveCustomStmt: Statement = database.prepare(`
    INSERT INTO urls (code, url, custom_text)
    values ('', ?, ?)
    RETURNING * 
`);

const getUrlStmt: Statement = database.prepare(`
    UPDATE urls
    SET clicks = clicks + 1,
        last_click = CURRENT_TIMESTAMP
    WHERE combined_code = ?
    RETURNING *    
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
    return getUrlStmt.get(code) as UrlRecord | undefined;
}

export function getUrlSilent(code: string): UrlRecord | undefined {
    return getUrlSilentStmt.get(code) as UrlRecord | undefined;
}


