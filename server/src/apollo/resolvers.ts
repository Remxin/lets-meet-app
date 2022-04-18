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
          console.log(event.organizatorId);
          const organizator = await User.findById(event.organizatorId);
          event.organizator = organizator;
          console.log(organizator, event);
          return event;
        })
      );
      return events1;
    },
    event: async (root: any, args: any) => await Event.findById(args.id),
  },
};
