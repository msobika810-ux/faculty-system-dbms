require('dotenv').config({ path: __dirname + '/.env' });
console.log("🔥 ACTUAL ENV LOADED:", {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    db: process.env.DB_NAME
});
//norequire('dotenv').config({ override: true });
console.log("LOADED HOST:", process.env.DB_HOST);
//console.log("DB_HOST:", process.env.DB_HOST);
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: "*"
}));
app.use(express.json());

const port = process.env.PORT || 5000;

// 🔍 DEBUG (VERY IMPORTANT)
console.log("ENV CHECK:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

// ❌ STOP if env not loaded
if (!process.env.DB_HOST) {
    console.error("❌ .env not loaded properly!");
    process.exit(1);
}

// ✅ Database Connection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 22116,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

const promisePool = pool.promise();

// --- Initialize Tables ---
async function initDb() {
    try {
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS faculty (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                department VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL
            )
        `);

        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS courses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                credits INT NOT NULL,
                faculty_id INT UNIQUE,
                FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE SET NULL
            )
        `);

        console.log("✅ Database tables verified/created.");
    } catch (err) {
        console.error("❌ DB Error:", err.message);
    }
}

initDb();

// --- API Routes ---

app.get('/api/faculty', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM faculty');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/faculty', async (req, res) => {
    const { name, department, email } = req.body;

    try {
        const [result] = await promisePool.query(
            'INSERT INTO faculty (name, department, email) VALUES (?, ?, ?)',
            [name, department, email]
        );

        res.status(201).json({ id: result.insertId, name, department, email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/courses', async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT c.*, f.name AS faculty_name
            FROM courses c
            LEFT JOIN faculty f ON c.faculty_id = f.id
        `);

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/courses', async (req, res) => {
    const { title, credits, faculty_id } = req.body;

    try {
        const [result] = await promisePool.query(
            'INSERT INTO courses (title, credits, faculty_id) VALUES (?, ?, ?)',
            [title, credits, faculty_id || null]
        );

        res.status(201).json({ id: result.insertId, title, credits, faculty_id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`🚀 Backend running on http://localhost:${port}`);
});