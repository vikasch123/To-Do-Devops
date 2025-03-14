const express = require("express");

const app = express();
const port = 3000;

// Default route to show a message
app.get("/", (req, res) => {
    res.send("Hello, this is a simple Node.js app for DevOps!");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
