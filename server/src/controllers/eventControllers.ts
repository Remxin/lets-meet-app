//@ts-nocheck
const jwt = require("jsonwebtoken");

import { emitWarning } from "process";
const Event = require("../models/Event");
const Chat = require("../models/Chat");
const User = require("../models/User");

export const createEvent = (req: Request, res: Response) => {
  //@ts-ignore
  const user = req.cookies.jwt;
  //   console.log(user);
  try {
    jwt.verify(
      user,
      process.env.JWT_TOKEN,
      async (err: Error, decodedToken: string) => {
        if (err) {
          return (
            res
              //@ts-ignore
              .status(403)
              .send({
                err: "You don't have permissions to execute this action",
              })
          );
        }
        // const { name, email, password, sex, age } = req.body;
        const {
          eventName,
          isPublic,
          premiumEvent,
          membersRestrictions,
          place,
          city,
          eventDescription,
          openChat,
        } = req.body;
        console.log(decodedToken.id);
        await Chat.create(
          { organizatorId: decodedToken.id, open: openChat },
          async (err: Error, chat: any) => {
            if (err) {
              console.log(`Error while creating chat: ${err}`);
              return res
                .status(500)
                .send({ err: "Internal server error - cannot create chat" });
            }
            await Event.create(
              {
                name: eventName,
                organizatorId: decodedToken.id,
                public: isPublic,
                premium: premiumEvent,
                membersRestrictions,
                place,
                city,
                description: eventDescription,
                chatId: chat._id,
              },
              (err: Error, event: any) => {
                if (err) {
                  console.log(`Error while creating event: ${err}`);
                  return res.status(500).send({
                    err: "Internal server error - cannot create event",
                  });
                }
                return res
                  .status(200)
                  .send({ msg: "Successfully created event and chat" });
              }
            );
          }
        );
      }
    );
  } catch (err) {
    console.log(`Cannot add event: ${err}`);
  }
};
