import { User_Interface } from "../../interfaces/user";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { config } from "dotenv";
import pool from "../../db/database-connection";
const hasKey = (obj:any,key:string)=>{
    return obj[key]
}
config()
class User{
    static pool = pool;
    private user:User_Interface;
    constructor(user:User_Interface){
        this.user = user;
    }
    public getUser(){
        return this.user
    }
    static  async findOne(user:User_Interface){
        let query=`SELECT * FROM USERS `;
        let args:string[]= []
        let argumentsCanBeSearched= ['username'] // only add keys here for adding 
        argumentsCanBeSearched.forEach((e)=>{
            if(hasKey(user,e))
            {
                if(args.length==0)
                {
                    query = query + ' WHERE '
                }
                else{
                    query = ' or '
                }
                query = query + (e).toString();
                args.push(e)
            }
        })
        query = 'LIMIT 1 ;'
       let result =  await User.pool.query(query,args)
        if(result.rowCount==0)
        {
            throw new Error("No user found !")
        }
        return result.rows[0] 
                ? (new User(result.rows[0])).getUser()
                : null 
    }
    public async createJWT(){
            const JWT = await jwt.sign(this.user,process.env.JWT_SECRET||'');
            this.user.jwt = JWT;
            return JWT
    }
    // static async checkJwtAndReturnUser(token:string){
    //     const isVerified = await jwt.verify(token,process.env.JWT_SECRET||'');
    //     if(isVerified)
    //         {
    //             let user = await jwt.decode(token);
    //             // await User.pool.query('SELECT * FROM USERS where username= $1',[user.username])
    //         }
    //     return new User({})
    // }
    public async save(){
        const user = await User.findOne(this.user)
        if(!user)
        {
            this.createUser(this.user);
        }
        else{
            this.updateUser(this.user)
        }
    }
    public async createUser(user:User_Interface){
        let encryptedPassword = await bcrypt.hash(user.password!,process.env.HASH_PASSWORD!)
        let saved_user = await User.pool.query(`INSERT INTO 
                                                  USERS(username,email,password,created_time,modified_time) 
                                                  VALUES($1,$2,$3,now(),now()) returning *`,[user.username,user.email,encryptedPassword])
        delete saved_user.rows[0]['password']
        this.user = (new User(saved_user.rows[0])).getUser()
    }  
    public async updateUser(user:User_Interface){
        // let canUpdateUserInfo =['password'] 
        if(user.password)
        {
            user.password = await bcrypt.hash(user.password!,process.env.HASH_PASSWORD!)
        }
        let updated_user = await User.pool.query(`UPDATE USERS 
                                                SET password = $2
                                                WHERE id = $1 
                                                returning *`,[user.id,user.password])

        delete updated_user.rows[0]['password']
        this.user = (new User(updated_user.rows[0])).getUser()
    }    
}
export default User