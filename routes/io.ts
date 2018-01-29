import {Application} from "express";
import * as io from 'socket.io';
import Socket = SocketIO.Socket;
import * as deb from 'debug';
import {Server} from "http";

const debug = deb('the-thief-server:socket.io');

export default function IoRoutes(server:Server) {
    debug('socket.io started');
    const socketIo = io.listen(server);
    initRoutes(socketIo);
}

function initRoutes(socketIo):void {
    socketIo.on('connection', onConnection);
}

function onConnection(socket:Socket):void {
    debug('a user connected');

    socket.on('disconnect', onDisconnect);
    socket.on('sendCoordinate', onSendCoordinate);
}

function onDisconnect():void {
    debug('user disconnected');
}

function onSendCoordinate(data:any):void {
    debug('sent coordinate is: ', data);
}
