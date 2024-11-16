const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const path = require('path');
const fs = require('fs');
const { error } = require('console');

// Construct the absolute path to the database file
const dbPath = path.resolve(__dirname, './db/database.db');

// Ensure the directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE , (err) => {
    if (err) {
        console.error("Error connecting to database: ", err.message);
    } else {
        console.log("Connected to the SQLite database.");
        // Create users table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            username TEXT NOT NULL,
            password TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error("Error creating users table: ", err.message);
            }
        });
        db.run(`CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT NOT NULL,
            subject TEXT,
            date TEXT,
            content TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`, (err) => {
            if (err) {
                console.error("Error creating posts table: ", err.message);
            }
        });
        db.run(`CREATE TABLE IF NOT EXISTS public_posts (
            username TEXT,
            date TEXT,
            content TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error("Error creating posts table: ", err.message);
            }
        });
    }
});

// Create an HTTP server
const server = http.createServer((req, res) => {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Basic route handling
    if (req.method === 'GET' && req.url === '/api/data') {
        const token = req.headers['authorization'];
        if (!token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Unauthorized' }));
            return;
        }

        const sql = 'SELECT id, email, username FROM users WHERE id = ?';
        const params = [token]; 
        db.get(sql, params, (err, row) => {
            if (err) {
                console.error("Error executing SQL query: ", err.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
                return;
            }
            if (row) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ id: row.id, email: row.email, username: row.username }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'User not found' }));
            }
        });
    }
    if (req.method === 'GET' && req.url === '/publicpost') {
        const sql = 'SELECT * FROM public_posts';
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error("Error executing SQL query: ", err.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
                return;
            }
            if (rows) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(rows));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'No public posts found' }));
            }
        });
    } else if (req.method === 'POST' && req.url === '/signup') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const sql = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
                const params = [data.email, data.username, data.password];
                db.run(sql, params, function(err) {
                    if (err) {
                        console.error("Error executing SQL query: ", err.message);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Email already exists '}));
                        return;
                    }
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'User added successfully', id: this.lastID }));
                });
            } catch (err) {
                console.error("Error parsing request body: ", err.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } else if (req.method === 'POST' && req.url === '/login') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
                const params = [data.email, data.password];
                db.get(sql, params, (err, row) => {
                    if(err) {
                        console.log("Error executing SQL query: ", err.message);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: err.message }));
                        return;
                    }
                    if(row) {
                        const token = row.id;
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Login successful' , token }));
                    }else{
                        res.writeHead(401, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid credentials' }));
                    }
                });
            }catch(err) {
                console.error("Error parsing request body: ", err.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } else if (req.method === 'POST' && req.url === '/form') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                const sql = 'INSERT INTO posts (user_id, title, subject, date, content) VALUES (?, ?, ?, ?, ?)';
                const params = [data.user_id, data.title, data.subject, data.date, data.content];
                db.run(sql, params, function(err) {
                    if (err) {
                        console.error("Error executing SQL query: ", err.message);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: err.message }));
                        return;
                    }
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Post added successfully', id: this.lastID }));
                });
            } catch (err) {
                console.error("Error parsing request body: ", err.message);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } else {
        const indexPath = path.join(__dirname, 'frontend/build', 'index.html');
        fs.readFile(indexPath, (err, data) => {
            if(err) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Not Found'}));
                return;
            }
        })
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
    }
});

// Start the server
server.listen(3001, (err) => {
    if (err) {
        console.error("Error starting the server: ", err.message);
    } else {
        console.log('Server is listening on port 3001');
    }
});