import express, { Router} from 'express'
// import Login from './routes/login'
const UserRouter:Router = express.Router()
UserRouter.get('/login',()=>{
    console.log('asdas')
})

export default UserRouter