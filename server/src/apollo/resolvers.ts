export const resolvers = {
  Query: {
    test: () => {
      console.log("jest");
      return "Hello world!";
    },
  },
};
