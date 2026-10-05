const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files
app.use(express.static(__dirname));

// Save registration data
app.post("/register", (req, res) => {
    const { name, email, mobile, branch, password } = req.body;

    if (!name || !email || !mobile || !branch || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    const filePath = path.join(__dirname, "student.json");

    let students = [];

    if (fs.existsSync(filePath)) {
        try {
            const data = fs.readFileSync(filePath, "utf8");
            if (data.trim()) {
                const parsed = JSON.parse(data);
                if (Array.isArray(parsed)) {
                    students = parsed;
                }
            }
        } catch (err) {
            console.error("Error reading student.json, resetting list:", err);
            students = [];
        }
    }

    const newStudent = {
        id: students.length + 1,
        name,
        email,
        mobile,
        branch,
        password,
        registeredAt: new Date().toISOString()
    };

    students.push(newStudent);

    try {
        fs.writeFileSync(
            filePath,
            JSON.stringify(students, null, 2),
            "utf8"
        );

        res.json({
            success: true,
            message: "Registration Successful! Saved to student.json.",
            student: newStudent
        });
    } catch (err) {
        console.error("Error saving student data:", err);
        res.status(500).json({
            success: false,
            message: "Failed to write data to student.json."
        });
    }
});

// View all saved registrations
app.get("/students", (req, res) => {
    const filePath = path.join(__dirname, "student.json");
    if (fs.existsSync(filePath)) {
        try {
            const data = fs.readFileSync(filePath, "utf8");
            if (data.trim()) {
                return res.json(JSON.parse(data));
            }
        } catch (err) {
            console.error("Error reading student.json:", err);
        }
    }
    res.json([]);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});