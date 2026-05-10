import Database from "better-sqlite3";
import { join } from "path";

const dbPath = join(process.cwd(), "db.sqlite");
const db = new Database(dbPath);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log("Tables:", tables);

const pinsCount = db.prepare("SELECT COUNT(*) as count FROM pins").get();
console.log("Pins count:", pinsCount);
