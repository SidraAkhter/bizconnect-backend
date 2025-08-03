"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptionsMiddleware = void 0;
const app_config_1 = require("../config/app.config");
const corsOptionsMiddleware = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        console.log('Received OPTIONS request', req.headers);
        res.header('Access-Control-Allow-Origin', app_config_1.config.FRONTEND_ORIGIN);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Expose-Headers', 'set-cookie');
        return res.status(200).send();
    }
    next();
};
exports.corsOptionsMiddleware = corsOptionsMiddleware;
