const Event = require("../models/Event");
const User = require("../models/User");
const City = require("../models/City")
const Place = require("../models/Place")

import {placesArgsType, eventArgsType, singlePlaceArgsType, myEventsArgsType} from './argsTypes'
import { placeType, eventType } from '../types/modelTypes';

export const resolvers = {
  Query: {
    test: () => {
      // console.log("jest");
      return "Hello world!";
    },
    events: async (root: any, args: myEventsArgsType) => {
      
      
      let events1 = await getProperEvents(args.userId, args.eventsType);
    
      
      let events = events1;
      if (!events || !Array.isArray(events)) return []
      // --- creating sql relation to adding event ogranizator ---
      events = await Promise.all(
        events.map(async (event: eventType) => {
          const organizator = await User.findById(event.organizatorId);
          event.organizator = organizator;

          const city = await City.findById(event.city)
          event.cityObj = city

          if (event.place.charAt(0) === "^") { // own place
            event.placeObj = null
          } else {
            const place = await Place.findById(event.place)
            event.placeObj = place
          }
          // console.log(organizator, event);
          return event;
        })
      );


      events = await Promise.all(
        //@ts-ignore
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
      const place = await Place.findById(event.place)
      event.placeObj = place
      const city = await City.findById(event.city)
      event.cityObj = city
      return event
      
    },

    places: async (root:any, args: placesArgsType) => {
      let places = await Place.find({verified: args.verified})
      // console.log(places) 
      try {
        places = await Promise.all(
          places.map(async (place: placeType) => {
            console.log(place.userId);
            
            if (place.userId) {
              const user = await User.findById(place.userId)
              place.user = user ? user : null

            } else {
              place.user = undefined
            }
            
            
            
            place.city = await City.findById(place.cityId)
            console.log(place);
            
            return place
          })
        )
      } catch (err) {
        return []
      }
      return places
    },

    place: async (root:any, args: singlePlaceArgsType) => {
   
        let place = await Place.findOne({_id: args.id, verified: args.verified})
        
        if (!place.userId) {
          place.user = undefined
        } else {
          place.user = await User.findById(place.userId)
        }
        place.city = await City.findById(place.cityId)
        return place

    },

    cities: async () => {
      let cities = await City.find()
      return cities
    }
  },
};

const getProperEvents = (userId?: string, eventType?: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      let events
      if (!userId) {
        events = await Event.find();
        resolve(events)
      } else {
        if (eventType === "myevents") {
          
          events = await Event.find({ organizatorId: userId })
          resolve(events)
          
        }
        events =  await Event.find({ members: userId })
        resolve(events)

      } 
      
    } catch (err) {
      reject({ err })
    }
  })
}
