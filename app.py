
from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
DB_NAME = 'njc_mining.db'

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            investment REAL NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/invest', methods=['POST'])
def invest():
    data = request.json
    username = data['username']
    investment = data['investment']

    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('INSERT INTO users (username, investment) VALUES (?, ?)', (username, investment))
    conn.commit()
    conn.close()

    return jsonify({"message": "تم تسجيل الاستثمار بنجاح"})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
