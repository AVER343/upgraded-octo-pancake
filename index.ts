import Server from './src/server'
let PORT = 5000
let server = new Server()
let app = server['app']
app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`)
})