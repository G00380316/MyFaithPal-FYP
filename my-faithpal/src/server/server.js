const express = require('express')
const app = express()

app.get("/api", (req, res) => {
    res.json({ "users": ["userOne"] })
})

app.listen(8080, () => { console.log("Server started on port http://127.0.0.1:8080")})