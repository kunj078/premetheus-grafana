import express from "express";
import { middleware } from "./middleware";
import { requestCountMiddleware } from "./monitering/requestCount";
import client from "prom-client";
import { cleanupMiddleware } from "./monitering/activeRequests";

const app = express();

app.use(express.json());
app.use(middleware);
app.use(requestCountMiddleware)
// app.use(cleanupMiddleware)
app.get("/user", (req, res) => {
    res.send({
        name: "John Doe",
        age: 25,
    });
});

app.get("/", (req, res) => {
    res.send({
        msg: "Health Check",
    });
});

app.post("/user", (req, res) => {
    const user = req.body;
    res.send({
        ...user,
        id: 1,
    });
});

app.get("/metrics", async (req, res) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
})

app.listen(3000);