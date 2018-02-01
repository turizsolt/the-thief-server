
import ServeLocation from "./ServeLocation";
import Socket = SocketIO.Socket;

import * as deb from 'debug';
const debug = deb('the-thief-server:cache-location');

export default class CacheLocation {
    private startTime = null;
    private interval = null;
    private firstInterval = null;
    private nextInterval = null;
    private nextTick = new Date();
    private tick = 5;
    private thief = "thief";
    private thiefSend = [];
    private serveLocation:ServeLocation;
    private socketIo: Socket;

    public constructor(socketIo: Socket) {
        debug('constructed, timer started');
        this.serveLocation = new ServeLocation();
        this.socketIo = socketIo;
        setInterval(() => {this.onTick(this)}, 1000);
    }

    public start(initData) {
        debug('start', initData);
        this.startTime = new Date();
        this.interval = parseInt(initData.interval,10) || 15;
        this.firstInterval = parseInt(initData.firstInterval, 10) || 15;
        this.nextInterval = new Date();
        this.nextInterval.setSeconds(this.nextInterval.getSeconds()+this.firstInterval);
        this.thief = initData.thief || this.thief;
        debug('new thief is: ', this.thief);
    }

    public stop() {
        debug('stop');
        this.nextInterval = null;
        this.thief = null;
        this.thiefSend = [];
    }

    public check(locationData, callback) {
        debug('check', locationData);
        this.serveLocation.store(locationData, callback);
    }

    public onTick(that) {
        debug('onTick');
        const now = new Date();

        if(that.nextTick && that.nextTick < now) {
            // tick
            debug('tick cops');
            that.nextTick.setSeconds(that.nextTick.getSeconds()+that.tick);

            that.serveLocation.retrieveCops(that.thief, (err, result) => {
                debug('emit coordinates');
                that.socketIo.emit('coordinates',{cops: result.filter(x => x._id).map(f), thiefs: that.thiefSend.map(f)});
            });
        }

        if(that.nextInterval && that.nextInterval < now) {
            // interval - showing up the thief
            debug('tick - thief');
            that.nextInterval.setSeconds(that.nextInterval.getSeconds()+that.interval);

            that.serveLocation.retrieveThief(that.thief, (err, result) => {
                that.thiefSend = result;
            });
        }
    }
}

function f(x) {
    console.log(x);
    if(x.timestamp && x.timestamp.getTime) {
        x.timestamp = x.timestamp.getTime();
    }
    return x;
}