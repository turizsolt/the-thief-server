import * as io from 'socket.io';
import Socket = SocketIO.Socket;
import * as deb from 'debug';
import {Server} from "http";
import CacheLocation from "../app/CacheLocation";

const debug = deb('the-thief-server:socket.io');
var cacheLocation:CacheLocation;

export default function IoRoutes(server:Server) {
    debug('socket.io started');
    const socketIo = io.listen(server);
    initRoutes(socketIo);
    cacheLocation = new CacheLocation(socketIo as any);
    return socketIo;
}

function initRoutes(socketIo):void {
    socketIo.on('connection', onConnection);
}

function onConnection(socket:Socket):void {
    debug('a user connected');
    socket.emit('connected');

    socket.on('disconnect', onDisconnect);
    socket.on('start', onStart);
    socket.on('stop', onStop);
    socket.on('check', onCheck);
}

function onDisconnect():void {
    debug('user disconnected');
}

function onCheck(data:any):void {
    debug('checked coordinate is: ', data);
    cacheLocation.check(data, (err, result)=>{
        debug('stored: ', err, result);
    });
}

function onStart(data:any):void {
    debug('start', data);
    cacheLocation.start(data);
}

function onStop():void {
    debug('stop');
    cacheLocation.stop();
}
