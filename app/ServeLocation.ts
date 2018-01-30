
import {LocationEntryClass, LocationEntry} from "../models/LocationEntry";

export default class ServeLocation {

    store(location: LocationEntry, callback) {
        LocationEntryClass.create(location, callback);
    }

    retrieveThief(thief, callback) {
        LocationEntryClass.aggregate([
            {
                $match: {
                    who: {$eq: thief}
                },
            },
            {
                $group: {
                    _id: '$who',
                    timestamp: {$last: '$timestamp'},
                    latitude: {$last: '$latitude'},
                    longitude: {$last: '$longitude'},
                    displayCharacter: {$last: '$displayCharacter'},
                    who: {$last: '$who'}
                }
            }
        ], callback);
    }

    retrieveCops(thief, callback) {
        LocationEntryClass.aggregate([
            {
                $match: {
                    who: {$ne: thief}
                },
            },
            {
                $group: {
                    _id: '$who',
                    timestamp: {$last: '$timestamp'},
                    latitude: {$last: '$latitude'},
                    longitude: {$last: '$longitude'},
                    displayCharacter: {$last: '$displayCharacter'},
                    who: {$last: '$who'}
                }
            }
        ], callback);
    }
}
