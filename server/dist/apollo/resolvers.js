"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const Event = require("../models/Event");
const User = require("../models/User");
const City = require("../models/City");
const Place = require("../models/Place");
const Opinion = require("../models/Opinion");
exports.resolvers = {
    Query: {
        test: () => {
            // console.log("jest");
            return "Hello world!";
        },
        events: (root, args) => __awaiter(void 0, void 0, void 0, function* () {
            let events1 = yield getProperEvents(args.userId, args.eventsType);
            let events = events1;
            if (!events || !Array.isArray(events))
                return [];
            // --- creating sql relation to adding event ogranizator ---
            events = yield Promise.all(events.map((event) => __awaiter(void 0, void 0, void 0, function* () {
                const organizator = yield User.findById(event.organizatorId);
                event.organizator = organizator;
                const city = yield City.findById(event.city);
                event.cityObj = city;
                if (event.place.charAt(0) === "^") { // own place
                    event.placeObj = null;
                }
                else {
                    const place = yield Place.findById(event.place);
                    event.placeObj = place;
                }
                // console.log(organizator, event);
                return event;
            })));
            events = yield Promise.all(
            //@ts-ignore
            events.map((event) => __awaiter(void 0, void 0, void 0, function* () {
                //@ts-ignore
                event.members = event.members.map((userId) => __awaiter(void 0, void 0, void 0, function* () {
                    return yield User.findById(userId);
                }));
            })));
            return events1;
        }),
        event: (root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const event = yield Event.findById(args.id);
            const membersTab = event.members.map((memberId) => __awaiter(void 0, void 0, void 0, function* () {
                return yield User.findById(memberId);
            }));
            event.members = membersTab;
            const organizator = yield User.findById(event.organizatorId);
            event.organizator = organizator;
            const place = yield Place.findById(event.place);
            event.placeObj = place;
            const city = yield City.findById(event.city);
            event.cityObj = city;
            return event;
        }),
        places: (root, args) => __awaiter(void 0, void 0, void 0, function* () {
            let places = yield Place.find({ verified: args.verified });
            // console.log(places) 
            try {
                places = yield Promise.all(places.map((place) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log(place.userId);
                    if (place.userId) {
                        const user = yield User.findById(place.userId);
                        place.user = user ? user : null;
                    }
                    else {
                        place.user = undefined;
                    }
                    place.city = yield City.findById(place.cityId);
                    console.log(place);
                    return place;
                })));
            }
            catch (err) {
                return [];
            }
            return places;
        }),
        place: (root, args) => __awaiter(void 0, void 0, void 0, function* () {
            let place = yield Place.findOne({ _id: args.id, verified: args.verified });
            if (!place.userId) {
                place.user = undefined;
            }
            else {
                place.user = yield User.findById(place.userId);
            }
            place.city = yield City.findById(place.cityId);
            return place;
        }),
        cities: () => __awaiter(void 0, void 0, void 0, function* () {
            let cities = yield City.find();
            return cities;
        }),
        placeOpinions: (root, args) => __awaiter(void 0, void 0, void 0, function* () {
            const opinions = yield Opinion.find({ placeId: args.placeId });
            if (!opinions)
                return [];
            for (let opinion of opinions) {
                opinion.user = yield User.findById(opinion.userId);
                opinion.place = yield Place.findById(opinion.placeId);
            }
            return opinions;
        })
    },
};
const getProperEvents = (userId, eventType) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let events;
            if (!userId) {
                events = yield Event.find();
                resolve(events);
            }
            else {
                if (eventType === "myevents") {
                    events = yield Event.find({ organizatorId: userId });
                    resolve(events);
                }
                events = yield Event.find({ members: userId });
                resolve(events);
            }
        }
        catch (err) {
            reject({ err });
        }
    }));
};
