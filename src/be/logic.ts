import { saveCustom, saveRandom, getUrlSilent, ClickRecord } from './db.js'
import { SqliteError } from 'better-sqlite3';
import { nanoid } from "nanoid"

export function saveUrlCustom(url: string, customText: string) {
    try {
        saveCustom(customText, url);
    } catch (err) {
        if (err instanceof SqliteError) {
            if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
                throw new Error("The custom alias is already taken");
            } else {
                throw new Error('SQLite constraint error');
            }
        } else {
            throw err;
        }
    }
}

export function saveUrlRandom(url: string): string {
    const existingRecord = getUrlSilent(url);
    if (existingRecord) {
        return existingRecord.code;
    }
    let code: string;
    let saved = false;
    do {
        code = nanoid(8);
        try {
            saveRandom(code, url);
            saved = true;
        } catch (err) {
            if ((err instanceof SqliteError)) {
                if (!(err.code === "SQLITE_CONSTRAINT_UNIQUE")) {
                    throw err;
                }
            } else {
                throw err;
            }
        }
    } while (!saved)
    return code;

}

