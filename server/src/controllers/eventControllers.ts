//@ts-nocheck
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

import { emitWarning } from "process";
import { verifyUser } from "../helpers/auth";
const Event = require("../models/Event");
const Chat = require("../models/Chat");
const User = require("../models/User");
const JoinRequest = require("../models/JoinRequest")
const UserPreferences = require("../models/UserPreferences")

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
        // console.log("verified");
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
          fileSrc,
          maxMembers,
          date
        } = JSON.parse(req.body.jsondataRequest);
        // console.log();
        
        // console.log(decodedToken.id);
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
                imageSrc: fileSrc,
                maxMembers,
                date
              },
              async (err: Error, event: any) => {
                if (err) {
                  console.log(`Error while creating event: ${err}`);
                  return res.status(500).send({
                    err: "Internal server error - cannot create event",
                  });
                }

                const userPreferences = await UserPreferences.findOne({ userId: decodedToken.id }).select("chatSections")
                const pushedChats = userPreferences.chatSections[0].chats
                pushedChats.push(chat._id.toString())

                await UserPreferences.updateOne({ _id: userPreferences._id, "chatSections.name": "my events chats" }, {
                  $set: {
                    "chatSections.$.chats": pushedChats
                  }
                })
                
                const userData = await User.findById(decodedToken.id).select("promotionEvents premium")
                console.log(userData);
                
                if (userData && !userData.premium) {
                  userData.promotionEvents = userData.promotionEvents - 1
                  await userData.save()
                }

   
                const file = req.files?.file;
           
                if (file) {
                  // creating file
                  const fileExt = file.name.split(".").pop();
           
                  file.mv(
                    `${__dirname}/../static/uploads/events/${event._id}.${fileExt}`,
                    async (err: Error) => {
                      if (err) {
                        return res.status(500).send({
                          err: "Internal server error - cannot save file",
                        });
                      }
                      event.imageSrc = `${process.env.SERVER_IP}/get/event-image/${event._id}.${fileExt}`
                      // event.imageSrc = `/static/uploads/events/${event._id}.${fileExt}`
                      await event.save()

                    
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

export const getEventImage = async (req: Request, res: Response) => {
  const urlParts =  req.url.split("/")
  const eventId = urlParts[urlParts.length - 1]
  
 
  if (!eventId) return res.send({ err: "Event not specified" })
  
  res.sendFile(path.join(__dirname + "/../static/uploads/events/" + eventId))
};

export const joinEvent = async (req: Request, res: Response) => {
  const { jwt } = req.cookies
  const user = await verifyUser(jwt)
  if (!user) return res.send({ err: "User not verified! "})


  const { eventId } = JSON.parse(req.body)
  const userAlreadyJoined = await JoinRequest.findOne({ userId: user.id })
  
  if (userAlreadyJoined) return res.send({ err: "You have already joined this event" })
  
  try {
    await JoinRequest.create({ userId: user.id, eventId })
  } catch (err) {
    return res.send({ err: "Internal server error "})
  }
  
  return res.send({ msg: "Successfully created join request"})

}

export const getEventRequests = async (req: Request, res: Response) => {
  const { jwt } = req.cookies
  
  const user = await verifyUser(jwt)
  
  if (!user) return res.send({ err: "Cannot verify user "})
  const { eventId } = JSON.parse(req.body)
  
  const requests = await JoinRequest.find({ eventId, accepted: "pending" }).lean()

  for (let request of requests) {
    const userData = await User.findOne({ _id: request.userId }).select("name date age sex")
    request.userData = userData
  }

  // console.log(requests);
  
  return res.send(requests)
}

export const acceptUser = async (req: Request, res: Response) => {
  console.log("leci");
  
  const { jwt } = req.cookies
  const user = await verifyUser(jwt)

  if (!user) return res.send({ err: "User not verified" })
  const { requestId } = JSON.parse(req.body)

  try {

  
  const request = await JoinRequest.findById(requestId)
  
  request.accepted = "yes"
  console.log(request);
  
  await request.save()
  console.log(request);

  const userPreferences = await UserPreferences.findOne({ userId: request.userId }).select("chatSections")
  const event = await Event.findById(request.eventId).select("chatId members")
  const chat = await Chat.findById(event.chatId).select("_id members")

  let otherChats = userPreferences.chatSections[1].chats
  otherChats.push(chat._id.toString())

  await UserPreferences.updateOne({ _id: userPreferences._id, "chatSections.name": "other" }, {
    $set: {
      "chatSections.$.chats": otherChats
    }
  })
  await userPreferences.save()

  event.members.push(request.userId)
  await event.save()

  console.log(chat);
  
  chat.members.push(request.userId)
  await chat.save()

  return res.send({ msg: "Success"})

  } catch (err) {
    console.log(err);
  }
  

}

export const rejectUser = async (req: Request, res: Response) => {
  const { jwt } = req.cookies
  const user = await verifyUser(jwt)

  if (!user) return res.send({ err: "User not verified" })
  const { requestId } = JSON.parse(req.body)

  try {
    const request = await JoinRequest.findById(requestId)
    request.accepted = "no"
    await request.save()

    return res.send({ msg: "Success"})

  } catch (err) {
    console.log(err);
  }
  

}
