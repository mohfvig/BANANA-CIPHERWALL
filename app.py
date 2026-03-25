import sqlite3
import datetime
import hashlib
from flask import Flask, render_template, request

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS visitors 
                      (hashed_ip TEXT UNIQUE, last_seen TIMESTAMP)''')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    user_ip = request.remote_addr
    hashed_ip = hashlib.sha256(user_ip.encode()).hexdigest()
    now = datetime.datetime.now()
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute("INSERT OR REPLACE INTO visitors (hashed_ip, last_seen) VALUES (?, ?)", (hashed_ip, now))
        conn.commit()
        cursor.execute("SELECT COUNT(*) FROM visitors")
        total_visitors = cursor.fetchone()[0]
        conn.close()
    except:
        total_visitors = "1"
    return render_template('index.html', total=total_visitors)

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)
