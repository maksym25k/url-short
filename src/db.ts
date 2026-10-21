import Database, { type Statement, type Database as DbType } from "better-sqlite3"

const database: DbType = new Database("../db/storage.db");

database.exec(`
CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL,
    clicks INTEGER NOT NULL DEFAULT 0,
    last_click DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
    INSERT INTO urls (code, url) 
    values("111", "https://calendar.google.com/calendar/u/0/r")
`)

export interface UrlRecord {
  id: number;
  code: string;
  url: string;
  clicks: number,
  last_click: string;
  created_at: string;
}

const saveCodeStmt: Statement = database.prepare(`
    INSERT INTO urls (code, url)
    values (?, ?)
`);

const getUrlStmt: Statement = database.prepare(`
    UPDATE urls
    SET clicks = clicks + 1,
        last_click = CURRENT_TIMESTAMP
    WHERE code = ?
    RETURNING *    
`);

export function getUrl (code: string): UrlRecord | undefined {
    return getUrlStmt.get(code) as UrlRecord | undefined;
}

export function saveCode(code: string, url: string ) {
    saveCodeStmt.run(code, url);
}

export default database;

