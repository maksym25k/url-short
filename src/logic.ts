import { saveCustom, saveRandom, getUrlSilent, getClicks, ClickRecord } from './db.js'
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

export function getUsageData(aliasList: string[]): Record<string, ClickRecord[]> {
    console.log("Getting usage data for alias list: ", aliasList);
    const { clicks, urls } = getClicks(aliasList);
    const groupedByUrlId =  Object.groupBy(clicks, (click) => click.url_id);
    const usageData = urls.map(url => {
        return [url.ident, groupedByUrlId[url.id] || []] as [string, ClickRecord[]];
    });
    return Object.fromEntries(usageData);
}