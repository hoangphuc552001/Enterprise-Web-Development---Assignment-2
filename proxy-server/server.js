import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PROXY_PORT || 5000;

app.use(cors());

if (!process.env.VITE_TMDB_KEY) {
    process.exit(1);
}

app.use('/api/tmdb', createProxyMiddleware({
    target: 'https://api.themoviedb.org/3',
    changeOrigin: true,
    pathRewrite: {
        '^/api/tmdb': '',
    },
    on: {
        proxyReq: (proxyReq, req, res) => {
            const url = new URL(proxyReq.path, 'https://api.themoviedb.org');
            url.searchParams.append('api_key', process.env.VITE_TMDB_KEY);
            proxyReq.path = url.pathname + url.search;
        }
    }
}));

app.listen(PORT, () => {});
