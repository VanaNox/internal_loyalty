#!/usr/bin/env python3
import json
import sqlite3
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

DB_PATH = Path("data.sqlite3")
HOST = "0.0.0.0"
PORT = 4173

USERS_SEED = [
    ("Катерина Д.", "kateryna.d@company.com", "demo123"),
    ("Оля К.", "olia.k@company.com", "demo123"),
    ("Максим П.", "maksym.p@company.com", "demo123"),
    ("Ірина С.", "iryna.s@company.com", "demo123"),
    ("Андрій Т.", "andrii.t@company.com", "demo123"),
    ("Світлана Р.", "svitlana.r@company.com", "demo123"),
    ("Дмитро Л.", "dmytro.l@company.com", "demo123"),
    ("Наталя В.", "natalia.v@company.com", "demo123"),
    ("Євген М.", "yevhen.m@company.com", "demo123"),
    ("Тарас Я.", "taras.ya@company.com", "demo123"),
]

PRODUCTS_SEED = [
    (
        "Футболка GemPulse",
        "Базова футболка з брендованим принтом",
        8,
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    ),
    (
        "Худі Team Hero",
        "Тепле худі для офісу та дому",
        12,
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
    ),
    (
        "Сертифікат Rozetka",
        "Електронний сертифікат номіналом 1000 грн",
        10,
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80",
    ),
    (
        "Квиток на конференцію",
        "Покриття квитка на профільний івент",
        14,
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
    ),
]


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_conn()
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          total_cost INTEGER NOT NULL,
          image_url TEXT NOT NULL
        )
        """
    )

    cur.execute("SELECT COUNT(1) FROM users")
    if cur.fetchone()[0] == 0:
        cur.executemany("INSERT INTO users(name, email, password) VALUES (?, ?, ?)", USERS_SEED)

    cur.execute("SELECT COUNT(1) FROM products")
    if cur.fetchone()[0] == 0:
        cur.executemany(
            "INSERT INTO products(name, description, total_cost, image_url) VALUES (?, ?, ?, ?)",
            PRODUCTS_SEED,
        )

    conn.commit()
    conn.close()


class AppHandler(SimpleHTTPRequestHandler):
    def _send_json(self, payload, status=HTTPStatus.OK):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/api/products":
            conn = get_conn()
            rows = conn.execute(
                "SELECT id, name, description, total_cost, image_url FROM products ORDER BY id"
            ).fetchall()
            conn.close()
            self._send_json(
                [
                    {
                        "id": row["id"],
                        "name": row["name"],
                        "description": row["description"],
                        "totalCost": row["total_cost"],
                        "image": row["image_url"],
                    }
                    for row in rows
                ]
            )
            return

        return super().do_GET()

    def do_POST(self):
        if self.path != "/api/login":
            self._send_json({"error": "Not found"}, HTTPStatus.NOT_FOUND)
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(content_length)

        try:
            payload = json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError:
            self._send_json({"error": "Invalid JSON"}, HTTPStatus.BAD_REQUEST)
            return

        email = (payload.get("email") or "").strip().lower()
        password = payload.get("password") or ""

        if not email or not password:
            self._send_json({"error": "Email and password are required"}, HTTPStatus.BAD_REQUEST)
            return

        conn = get_conn()
        row = conn.execute(
            "SELECT id, name, email FROM users WHERE lower(email)=? AND password=?",
            (email, password),
        ).fetchone()
        conn.close()

        if not row:
            self._send_json({"error": "Invalid credentials"}, HTTPStatus.UNAUTHORIZED)
            return

        self._send_json(
            {
                "ok": True,
                "user": {
                    "id": row["id"],
                    "name": row["name"],
                    "email": row["email"],
                },
            }
        )


if __name__ == "__main__":
    init_db()
    server = ThreadingHTTPServer((HOST, PORT), AppHandler)
    print(f"Serving app + API on http://{HOST}:{PORT}")
    server.serve_forever()
