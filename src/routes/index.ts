import UserRoutes from './user-routes/index'
import express, {Router} from 'express'
const RouterConfig:Router = express.Router()
RouterConfig.use('/users',UserRoutes)
export default RouterConfig