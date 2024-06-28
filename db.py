import sqlite3

def init_db():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
    ''')
    
    # Insert dummy entries
    cursor.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', ('John Doe', 'john@example.com', 'password123'))
    cursor.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', ('Jane Smith', 'jane@example.com', 'password456'))
    
    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
