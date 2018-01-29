import {Document, Schema, model} from 'mongoose';

export interface LocationEntry{
    latitude: number,
    longitude: number,
    altitude: number,
    verticalAccuracy: number,
    horisontalAccuracy: number,
    speed: number,
    timestamp: Date,
    who: string,
    displayCharacter: string
};

export interface LocationEntryModel extends LocationEntry, Document {};

var locationEntrySchema = new Schema({
    latitude: Number,
    longitude: Number,
    altitude: Number,
    verticalAccuracy: Number,
    horisontalAccuracy: Number,
    speed: Number,
    timestamp: {type: Date, index: {unique: false}},
    who: {type: String, index: {unique: false}},
    displayCharacter: String
});

export var LocationEntryClass = model<LocationEntryModel>("LocationEntry", locationEntrySchema);
