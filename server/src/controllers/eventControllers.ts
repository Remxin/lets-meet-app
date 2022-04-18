//@ts-nocheck
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

import { emitWarning } from "process";
const Event = require("../models/Event");
const Chat = require("../models/Chat");
const User = require("../models/User");

// export const createEvent = (req: Request, res: Response) => {
//   //@ts-ignore
//   const user = req.cookies.jwt;
//   //   console.log(user);
//   try {
//     jwt.verify(
//       user,
//       process.env.JWT_TOKEN,
//       async (err: Error, decodedToken: string) => {
//         if (err) {
//           return (
//             res
//               //@ts-ignore
//               .status(403)
//               .send({
//                 err: "You don't have permissions to execute this action",
//               })
//           );
//         }
//         // const { name, email, password, sex, age } = req.body;
//         const {
//           eventName,
//           isPublic,
//           premiumEvent,
//           membersRestrictions,
//           place,
//           city,
//           eventDescription,
//           openChat,
//         } = req.body;
//         console.log(decodedToken.id);
//         await Chat.create(
//           { organizatorId: decodedToken.id, open: openChat },
//           async (err: Error, chat: any) => {
//             if (err) {
//               console.log(`Error while creating chat: ${err}`);
//               return res
//                 .status(500)
//                 .send({ err: "Internal server error - cannot create chat" });
//             }
//             await Event.create(
//               {
//                 name: eventName,
//                 organizatorId: decodedToken.id,
//                 public: isPublic,
//                 premium: premiumEvent,
//                 membersRestrictions,
//                 place,
//                 city,
//                 description: eventDescription,
//                 chatId: chat._id,
//               },
//               (err: Error, event: any) => {
//                 if (err) {
//                   console.log(`Error while creating event: ${err}`);
//                   return res.status(500).send({
//                     err: "Internal server error - cannot create event",
//                   });
//                 }
//                 return res.status(200).send({
//                   msg: "Successfully created event and chat",
//                   id: event._id,
//                 });
//               }
//             );
//           }
//         );
//       }
//     );
//   } catch (err) {
//     console.log(`Cannot add event: ${err}`);
//   }
// };

export const uploadEventImage = (req: Request, res: Response) => {
  const user = req.cookies.jwt;
  try {
    jwt.verify(user, process.env.JWT_TOKEN, (err: Error, decodedUser: any) => {
      if (err) {
        return res
          .status(403)
          .send({ err: "You don't have permissions to perform this action" });
      }
      const {
        eventName,
        isPublic,
        premiumEvent,
        membersRestrictions,
        place,
        city,
        eventDescription,
        openChat,
      } = JSON.parse(req.body.jsondataRequest);
      const file = req.files?.file;

      if (file) {
        // creating file
        const fileExt = file.name.split(".").pop();

        file.mv(
          `${__dirname}/../static/uploads/events/${id}.${fileExt}`,
          (err: Error) => {
            if (err) {
              return res
                .status(500)
                .send({ err: "Internal server error - cannot save file" });
            }
            return res.status(200).send({ msg: "Successfully saved file" });
          }
        );
      }
    });
  } catch (err) {
    return res.status(400).send({ err: "Bad request" });
  }
};

export const createEvent = (req: Request, res: Response) => {
  // FIXME: integrate add event + upload event image
  //@ts-ignore
  const user = req.cookies.jwt;
  try {
    // user verification
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
        console.log("verified");
        // getting data from request
        const {
          eventName,
          isPublic,
          premiumEvent,
          membersRestrictions,
          place,
          city,
          eventDescription,
          openChat,
        } = JSON.parse(req.body.jsondataRequest);
        console.log(
          eventName,
          isPublic,
          premiumEvent,
          membersRestrictions,
          place,
          city,
          eventDescription,
          openChat
        );
        console.log(decodedToken.id);
        await Chat.create(
          // creating chat for event
          { organizatorId: decodedToken.id, open: openChat },
          async (err: Error, chat: any) => {
            if (err) {
              console.log(`Error while creating chat: ${err}`);
              return res
                .status(500)
                .send({ err: "Internal server error - cannot create chat" });
            }
            console.log("chat jest ");
            await Event.create(
              // creating event and linking chat to it
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
                console.log("event jest");
                const file = req.files?.file;
                console.log(file);
                if (file) {
                  // creating file
                  const fileExt = file.name.split(".").pop();
                  console.log(fileExt);
                  file.mv(
                    `${__dirname}/../static/uploads/events/${event._id}.${fileExt}`,
                    (err: Error) => {
                      if (err) {
                        return res.status(500).send({
                          err: "Internal server error - cannot save file",
                        });
                      }
                      return res.status(200).send({
                        msg: "Successfully saved file, created event and chat",
                      });
                    }
                  );
                } else {
                  return res.status(200).send({
                    msg: "Successfully created event and chat - image default",
                  });
                }
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

export const getEventImage = (req: Request, res: Response) => {
  const eventId = req?.query?.eventId;
  console.log(eventId);
  const dir = path.join(__dirname, "/../static/uploads/events");
  const files = fs.readdirSync(dir);

  for (const file of files) {
    let filename = file + "";
    console.log(filename);
    if (filename.includes(eventId)) {
      console.log("this one");
      return res.sendFile(
        path.join(__dirname + `/../static/uploads/events/${filename}`)
      );
    }
  }
  return res.sendFile(
    path.join(__dirname + "/../static/uploads/events/default.png")
  );
};
