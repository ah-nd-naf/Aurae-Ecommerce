const express = require("express");
const { PrismaClient } = require('./generated/prisma');
require('dotenv').config();


const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const app = express();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(express.json()); // Allows us to read JSON data sent to the server

// A simple test route to see if the server is alive
app.get("/", (req, res ) => {
    res.send("Aurae backend is running ");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
