require('dotenv').config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(express.json()); // Allows us to read JSON data sent to the server

// Mount authentication routes
app.use("/api/auth", authRoutes);

// Mount product routes
app.use("/api/products", productRoutes);

// A simple test route to see if the server is alive
app.get("/", (req, res) => {
    res.send("Aurae backend is running ");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
