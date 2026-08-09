import sqlite3
import json
from datetime import datetime

DB_PATH = "pramana.db"


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # lets us access columns by name
    return conn


def init_db():
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            title TEXT,
            analyzed_at TEXT NOT NULL,
            result_json TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


def save_analysis(filename: str, result: dict) -> int:
    conn = get_connection()
    cursor = conn.execute(
        "INSERT INTO history (filename, title, analyzed_at, result_json) VALUES (?, ?, ?, ?)",
        (filename, result.get("title", "Untitled"), datetime.utcnow().isoformat(), json.dumps(result)),
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return new_id


def list_history() -> list[dict]:
    conn = get_connection()
    rows = conn.execute(
        "SELECT id, filename, title, analyzed_at FROM history ORDER BY analyzed_at DESC"
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_history_item(item_id: int) -> dict | None:
    conn = get_connection()
    row = conn.execute("SELECT * FROM history WHERE id = ?", (item_id,)).fetchone()
    conn.close()
    if row is None:
        return None
    data = dict(row)
    data["result"] = json.loads(data.pop("result_json"))
    return data


def delete_history_item(item_id: int) -> bool:
    conn = get_connection()
    cursor = conn.execute("DELETE FROM history WHERE id = ?", (item_id,))
    conn.commit()
    deleted = cursor.rowcount > 0
    conn.close()
    return deleted