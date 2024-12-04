const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..")));

const db = new sqlite3.Database(path.join(__dirname, "database.db"), (err) => {
    if (err) {
        console.error("Failed to connect to the database:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS personal_details (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT,
            email TEXT,
            phone_number TEXT,
            gender TEXT,
            date_of_birth TEXT,
            linkedin TEXT,
            website TEXT,
            photo TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS experience_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT,
            hobbies TEXT,
            work_experience TEXT,
            education TEXT,
            skills TEXT
        )
    `);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.post("/personal-details", (req, res) => {
    const { full_name, email, phone_number, gender, date_of_birth, linkedin, website, photo } = req.body;

    db.run(
        `
        INSERT INTO personal_details (
            full_name, email, phone_number, gender, date_of_birth, linkedin, website, photo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [full_name, email, phone_number, gender, date_of_birth, linkedin, website, photo],
        function (err) {
            if (err) {
                console.error("Error inserting personal details:", err.message);
                res.status(500).send("Failed to save personal details.");
            } else {
                res.status(200).send("Personal details saved successfully.");
            }
        }
    );
});

app.get("/personal-details", (req, res) => {
    db.get("SELECT * FROM personal_details ORDER BY id DESC LIMIT 1", (err, row) => {
        if (err) {
            console.error("Error fetching personal details:", err.message);
            res.status(500).send("Failed to fetch personal details.");
        } else {
            res.json(row || {});
        }
    });
});

app.post("/experience", (req, res) => {
    const { description, hobbies, workExperience, education, skills } = req.body;

    db.run(
        `
        INSERT INTO experience_data (description, hobbies, work_experience, education, skills) 
        VALUES (?, ?, ?, ?, ?)
        `,
        [description, hobbies, JSON.stringify(workExperience), JSON.stringify(education), JSON.stringify(skills)],
        function (err) {
            if (err) {
                console.error("Error saving experience data:", err.message);
                res.status(500).send("Internal Server Error");
            } else {
                res.status(201).send({ id: this.lastID });
            }
        }
    );
});

app.get("/experience", (req, res) => {
    db.get("SELECT * FROM experience_data ORDER BY id DESC LIMIT 1", (err, row) => {
        if (err) {
            console.error("Error fetching experience data:", err.message);
            res.status(500).send("Failed to fetch experience data.");
        } else {
            res.json(row || {});
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
