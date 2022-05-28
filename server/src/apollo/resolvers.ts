const Event = require("../models/Event");
const User = require("../models/User");
const City = require("../models/City")
const Place = require("../models/Place")

import {placesArgsType, eventArgsType, singlePlaceArgsType} from './argsTypes'
import { placeType, eventType } from '../types/modelTypes';

export const resolvers = {
  Query: {
    test: () => {
      console.log("jest");
      return "Hello world!";
    },
    events: async () => {
      let events1 = await Event.find();
      let events = events1;
      // --- creating sql relation to adding event ogranizator ---
      events = await Promise.all(
        events.map(async (event: eventType) => {
          const organizator = await User.findById(event.organizatorId);
          event.organizator = organizator;
          console.log(organizator, event);
          return event;
        })
      );
      events = await Promise.all(
        events.map(async (event: eventType) => {
          //@ts-ignore
          event.members = event.members.map(async (userId: String) => {
            return await User.findById(userId)
          })
        })
      )
      return events1;
    },
    event: async (root: any, args: eventArgsType) => {

      const event = await Event.findById(args.id)
      const membersTab = event.members.map(async (memberId: String) => {
        return await User.findById(memberId)
      })
      event.members = membersTab
      const organizator = await User.findById(event.organizatorId)
      event.organizator = organizator
      return event
      
    },

    places: async (root:any, args: placesArgsType) => {
      let places = await Place.find({verified: args.verified})
      // console.log(places) 
      places = await Promise.all(
        places.map(async (place: placeType) => {
          place.user = await User.findById(place.userId)
          place.city = await City.findById(place.cityId)
          return place
        })
      )
      return places
    },

    place: async (root:any, args: singlePlaceArgsType) => {
   
        let place = await Place.findOne({_id: args.id, verified: args.verified})
        
        place.user = await User.findById(place.userId)
        place.city = await City.findById(place.cityId)
        return place

    },

    cities: async () => {
      let cities = await City.find()
      return cities
    }
  },
};
