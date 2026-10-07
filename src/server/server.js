const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config({
  path: "./server/.env",
});

const app = express();

const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminUsername || !adminPassword) {
  console.error("❌ Admin credentials are missing.");
  console.error("Please check server/.env");
  process.exit(1);
}

const passwordHash = bcrypt.hashSync(adminPassword, 10);

app.get("/", (req, res) => {
  res.json({
    message: "QUIZZIE Authentication Server is running.",
  });
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const usernameCorrect = username === adminUsername;

    const passwordCorrect = await bcrypt.compare(
      password,
      passwordHash
    );

    if (!usernameCorrect || !passwordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    return res.json({
      success: true,
      user: {
        role: "admin",
        name: "Administrator",
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong on the server.",
    });
  }
});

app.listen(PORT, () => {
  console.log("");
  console.log("🏆 QUIZZIE Authentication Server");
  console.log("--------------------------------");
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("");
});