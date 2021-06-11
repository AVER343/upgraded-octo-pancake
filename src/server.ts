import express from 'express';
import RouterConfig from './routes';
class Server {
    private app;

    constructor() {
        this.app = express();
        this.config();
        this.routerConfig()
    }
    private config() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json()); 
    }
    private routerConfig(){
        this.app.use(RouterConfig)
    }
}
export default Server