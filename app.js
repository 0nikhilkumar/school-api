import express from "express";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


import schoolRouter from "./routes/school.js"

app.use("/api", schoolRouter);



