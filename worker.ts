import http from 'node:http';
import { httpServerHandler } from 'cloudflare:node';
import { createApp } from './server.ts';

export default httpServerHandler(http.createServer(createApp()));
