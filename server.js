const express = require("express")
const path = require("path")

const app = express()
const port = process.env.PORT || 3000

// Enable CORS for development
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// Serve static files
app.use(express.static(path.join(__dirname, "public")))

// API route to fetch products
app.get("/api/products", async (req, res) => {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=10")
    if (!response.ok) {
      throw new Error("Failed to fetch from external API")
    }
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ error: "Failed to fetch products" })
  }
})

// Serve index.html for all routes (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

