import { NextFunction, Request, Response } from "express";
import client from "prom-client";
import { cleanupMiddleware } from "./activeRequests";

// Create a counter metric
// export const requestCounter = new client.Counter({
//     name: 'http_requests_total',
//     help: 'Total number of HTTP requests',
//     labelNames: ['method', 'route']
// });


export const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000] 
});


export const requestCountMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const endTime = Date.now();
        console.log(`Request took ${endTime - startTime}ms`);

        // Increment request counter
        // requestCounter.inc({
        httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            code: res.statusCode.toString(),
        }, endTime - startTime);
    });

    next();
};