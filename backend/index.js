import express from "express"; //importing express module
import dotenv from "dotenv"; //importing dotenv module. It gonna allow us to reach config's contents on process.env
dotenv.config({path:"./config/config.env"}); //specifying the path of config file
import {createServer} from "http"; //importing http module
import {Server} from "socket.io"; //importing Server class from socketIO module

const app = express(); //creating an app from express's constructor
const httpServer = createServer(app); //creating a http server that listens to server ports and gives a response back to the client.
const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log(`${socket} connected!`);
})


httpServer.listen(process.env.PORT, () => console.log(`Http server started at ${process.env.PORT}`));

