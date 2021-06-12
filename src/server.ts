import express from 'express';
import { Pool } from 'pg';
import pool from './db/database-connection';
import RouterConfig from './routes';
class Server {
    private app;
    private PORT = 5000;
    static pg_connection:Pool = pool;
    constructor() {
        this.app = express();
        this.config();
        this.routerConfig();
    }
    private config() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json()); 
    }
    private routerConfig(){
        this.app.use(RouterConfig)
    }
    public start(){
        this.app.listen(this.PORT,()=>{
            console.log(`Server is listening on ${this.PORT}`)
        })
    }
}
export default Server