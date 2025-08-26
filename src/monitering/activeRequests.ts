import { NextFunction, Request, Response } from "express";
// import { requestCounter } from "./requestCount";
import client from "prom-client";

const activeRequestsGauge = new client.Gauge({
    name: 'active_requests',
    help: 'Number of active requests'
});

export const cleanupMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    activeRequestsGauge.inc();

    res.on('finish', function() {
        const endTime = Date.now();
        console.log(`Request took ${endTime - startTime}ms`);
        
        // requestCounter.inc({
        //     method: req.method,
        //     route: req.route ? req.route.path : req.path,
            // code: res.statusCode.toString(),
        // });
        activeRequestsGauge.dec();
    });
    next();
}
