import Database, { type Statement, type Database as DbType } from "better-sqlite3"

const database: DbType = new Database("./storage.db");

database.exec(`
CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL,
    custom_text TEXT,
    combined_code TEXT GENERATED ALWAYS AS (custom_text || '_' || code) STORED,
    clicks INTEGER NOT NULL DEFAULT 0,
    last_click DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`)

export interface UrlRecord {
  id: number;
  code: string;
  url: string;
  combined_code: string;
  clicks: number,
  last_click: string;
  created_at: string;
}

const saveCodeStmt: Statement = database.prepare(`
    INSERT INTO urls (code, url, custom_text)
    values (?, ?, ?) 
    RETURNING *
`);

const getUrlStmt: Statement = database.prepare(`
    UPDATE urls
    SET clicks = clicks + 1,
        last_click = CURRENT_TIMESTAMP
    WHERE combined_code = ?
    RETURNING *    
`);

export function getUrl (code: string): UrlRecord | undefined {
    console.log(code);
    return getUrlStmt.get(code) as UrlRecord | undefined;
}

export function saveCode(code: string, url: string, text: string): boolean {
    console.log(code, url, text);
    try {
        saveCodeStmt.run(code, url, text);
    } catch (err) {
        console.log(err);
        return false;
    };
    return true;   
}   

export default database;

