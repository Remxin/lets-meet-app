//@ts-nocheck
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const fs = require('fs')

const Place = require("../models/Place");
const User = require("../models/User");
const Opinion = require("../models/Opinion")

import { verifyAdmin, verifyUser } from "../helpers/auth";
import { getPlaceImageLength, getPlaceImage, deletePlaceImageFolder, saveImage } from "../helpers/images";
import { placeImgQueryType } from '../types/requestTypes'

export const placeCreationRequest = (req: Request, res: Response) => {
  const user = req.cookies.jwt;
  try {
    jwt.verify(
      user,
      process.env.JWT_TOKEN,
      async (err: Error, decodedUser: any) => {
        if (err) {
          return res.status(403).send({
            err: "You don't have right access to perform this action",
          });
        }
        const {
          name,
          localizationString,
          website,
          description,
          localizationCords,
        } = req.body;
        const userId = decodedUser.id;
        await Place.create(
          {
            name,
            localizationString,
            localizationCords,
            website,
            description,
            userId, // ustawiamy userId na początku na id uzytkownika, który je doda, by wynagrodzić go darmowym punktem promocji wydarzenie za poprawne dodanie miejsca
          },
          (err: Error) => {
            if (err) {
              return res
                .status(500)
                .send({ err: "Internal server error - cannot create place" });
            }
            return res
              .status(200)
              .send({ msg: "Successfully added new place" });
          }
        );
      }
    );
  } catch (err) {
    console.log(`User cannot send place creation request: ${err}`);
  }
};

export const placeImgLen = async (req: Request, res: Response) => {
  const token = req.cookies?.jwt 
  const placeId = req?.query?.placeId;
  if (!placeId) {
    return res.send({err: "No place id passed"})
  }
  if (!token) {
    return res.send({err: "User not registered"})
  }
  const user = await verifyUser(token)
  if (!user) {
    return res.send({err: "User not verified"})
  }

  const len = await getPlaceImageLength(placeId)
  return res.send({len})

};

export const getPlaceImg = async (req: Request, res: Response) => {
  const token = req.cookies?.jwt
  if (!token) {
    return res.send({err: "User not registered"})
  }

  const user = await verifyUser(token)
  if (!user) {
    return res.send({err: "User not verified"})
  }
  const {placeId, photoIndex}: placeImgQueryType = req.query
  if (!placeId || !photoIndex) {
    return res.send({err: "Bad request"})
  }

  const image = await getPlaceImage(photoIndex, placeId)
  if (image.err) return res.send({err: "Image index out of range"})
  return res.sendFile(image.path)
}

export const verifyPlace = async (req: Request, res: Response) => {
  if (!req.cookies?.jwtA) {
    return res.send({err: "You don't have permissions to perform this action"})
  }
  
  let admin = await verifyAdmin(req.cookies.jwtA)
  // console.log(admin)

  if (admin.err) {
    return res.send({err: "You don't have permissions to perform this action"})
  }

  const placeId = JSON.parse(req.body).placeId;
  const place = await Place.findOne({ _id: placeId });
  if (!place) {
    return res.send({err: "Cannot find this place!"})
  }

  const addingUserId = place.userId;
  place.verified = true;
  place.userId = ""; // teraz ustawiam na puste, poniewaz tutaj będzie oficjalne konto miejsca, jeśli będzie chciało
  await place
    .save() // aktualizowanie statusu miejsca na verified
    .then(async () => {
      if (addingUserId) {
      const addingUserInfo = await User.findOne({ _id: addingUserId }); // dodawanie userowi za nagrodę darmową promocję eventu
        addingUserInfo.promotionEvents += 0.25; // promotion events given to user
        addingUserInfo
        .save()
        .then(() => {
          return res
          .status(200)
          .send({ msg: "Successfully verified place" });
        })
        .catch((err: Error) => {
          console.log(
            `Adding promotion event points to user ${addingUserId} failed - give him manually`
            ); // nalezy dodać uzytkownikowi 1 darmowy punkt promocji wydarzenia manualnie i sprawdzic, co jest nie tak z serwerem
            return res.status(500).send({
              err: "Internal server error - place successfully added, but user promotion points do not increase - administrator will give them manually",
            });
          });
        }
        return res.send({ msg: "Success"})
      })
}

export const rejectPlace = async (req: Request, res: Response) => {
  const token = req.cookies?.jwtA
  if (!token) {
    return res.send({err: "User not verified!"})
  }

  const admin = await verifyAdmin(token)
  if (!admin) {
    return res.send({err: "You don't have permissions to perform this action"})
  }

  const placeId = JSON.parse(req.body).placeId
  if (!placeId) {
    return res.send({err: "Bad request"})
  }

  try {
    // deleting document
    await Place.deleteOne({_id: placeId})
    const deleted = await deletePlaceImageFolder(placeId)
    if (deleted.err) {
      res.send({ err: "Deleted Place, but cannot deleted its image folder" })
    }

    return res.send({msg: "Successfully detelet document"})
  } catch (err) {
    console.log(err)
    return res.send({err: "Error in deleting document"})
  }

}

export const getCityPlaces = async (req, res) => {
  const token = req.cookies?.jwt
  if (!token) {
    return res.send({err: "User not verified!"})
  }

  const user = await verifyUser(token)
  if (!user) {
    return res.send({err: "User not verified"})
  }
  const cityId = JSON.parse(req.body).cityId
  if (!cityId) {
    const returnCities = await Place.find({ verified: true })
    return res.send(returnCities)
  }
  const returnCities = await Place.find({cityId, verified: true})
  return res.send(returnCities)
}

export const uploadPlaceImages = async (req, res) => {
  const token = req.cookies?.jwt
  if (!token) return res.send({err: "User not verified"})
  const user = await verifyUser(token)
  if (!user) return res.send({err: "User not verified"})

  let files = req.files
  const data = JSON.parse(req.body.jsondatarequest)
  const { name, address, website, cityId, localizationString, description, imagesLen } = data
  const filesArr = []

  for (let i = 0 ; i < imagesLen; i++) {
    filesArr.push(files["file" + i])
  }


  const place = await Place.create({ name, addressString: address, website, cityId, localizationString, description, user: user.id })
  // console.log(place)

  let localizationDir = `${__dirname}/../static/uploads/places/${place._id}`

  if (!fs.existsSync(localizationDir)){
    fs.mkdirSync(localizationDir);
}
  
  let incrementer = 0
  for (let file of filesArr) {
    const ext = file.name.split(".").pop()
    const res = await saveImage(file, localizationDir + "/" + incrementer + "." + ext)
    if (res.err) return res.send({err: "error in saving files"})
    incrementer++
  }
  return res.send({msg: "Success!"})
}

export const sendOpinion = async (req: Request, res: Response) => {
  const { jwt } = req.cookies

  const user = await verifyUser(jwt)
  if (!user) return res.send({ err: "user not verified" })

  const { placeId, comment, stars } = JSON.parse(req.body)
  try {
    
    const opinion = await Opinion.create({ userId: user.id, placeId, comment, stars })
    const placeOpinions = await Opinion.find({ placeId })
    console.log(opinion);
    
    
    // calculating stars
    const sum = placeOpinions.reduce((a, b) => {
      return a + b.stars
    
    }, 0);
    
    // average rating + rounding value
    let avg = (sum / placeOpinions.length)
    avg = Math.floor(avg * 10) / 10
    
    await Place.findOneAndUpdate({ _id: placeId }, { opinionStars: avg}, {
      new: true,
      upsert: true      
    })

    return res.send({ msg: "opinion successfully sended" })
  } catch (err) {
    return res.send({ err: "Internal server error" })
  }

}