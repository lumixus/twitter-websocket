import express from "express"; //importing express module
import dotenv from "dotenv"; //importing dotenv module. It gonna allow us to reach config's contents on process.env
dotenv.config({path:"./config/config.env"}); //specifying the path of config file
import {createServer} from "http"; //importing http module
import {WebSocketServer} from "ws"; //importing Server class from socketIO module
import routes from "./routes/index.js";
import errorHandler from "./middlewares/error/errorHandler.js";
import fileUpload from "express-fileupload";
import limiter from "./middlewares/security/rateLimit.js";
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express(); //creating an app from express's constructor
const httpServer = createServer(app); //creating a http server that listens to server ports and gives a response back to the client.
const wss = new WebSocketServer({server:httpServer});

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(cookieParser())
app.use(express.json()); //it parses the request and we can reach informations from req.body
app.use(fileUpload({limits: {fileSize:5*1024*1024}})); //file upload middleware
app.use(limiter);
app.use("/", routes); //our app's route schema
app.use(errorHandler); //adding error handler middleware

wss.on("connection", (socket) =>  { //when connection comes from client, do this function.
    console.log(`${socket} connected`);
});

httpServer.listen(process.env.PORT, () => console.log(`Http server started at ${process.env.PORT}`));

