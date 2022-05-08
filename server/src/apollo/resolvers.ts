const Event = require("../models/Event");
const User = require("../models/User");

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
        events.map(async (event: any) => {
          const organizator = await User.findById(event.organizatorId);
          event.organizator = organizator;
          console.log(organizator, event);
          return event;
        })
      );
      events = await Promise.all(
        events.map(async (event: any) => {
          event.members = event.members.map(async (userId: any) => {
            return await User.findById(userId)
          })
        })
      )
      return events1;
    },
    event: async (root: any, args: any) => {

      const event = await Event.findById(args.id)
      const membersTab = event.members.map(async (memberId: String) => {
        return await User.findById(memberId)
      })
      event.members = membersTab
      // console.log(event.organizator)
      const organizator = await User.findById(event.organizatorId)
      // console.log(organizator)
      event.organizator = organizator
      console.log(event)
      return event
      
    },
  },
};
