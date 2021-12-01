require("dotenv").config()
const Express = require("express");
const app = Express();
const dbConnection = require("./db");

const controllers = require("./controllers");

app.use(Express.json())

app.use("/user", controllers.usercontroller)

app.use(require("./middleware/validate-jwt"));
app.use("/log", controllers.logcontroller)


dbConnection.authenticate()
.then(() => dbConnection.sync())
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`[Server] listening on port ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log(`[Server] crashed`)
    console.log(err)
}) 



