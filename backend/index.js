import express from "express"; //importing express module
import dotenv from "dotenv"; //importing dotenv module. It gonna allow us to reach config's contents on process.env
dotenv.config({path:"./config/config.env"}); //specifying the path of config file
import http from "http"; //importing http module
import {Server} from "socket.io"; //importing Server class from socketIO module

const server = http.createServer(); //creating a http server that listens to server ports and gives a response back to the client.
const app = express(); //creating an app from express's constructor
const io = new Server(server);

server.listen(process.env.PORT, () => console.log(`Server started at ${process.env.PORT}`));