//@ts-nocheck
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const Place = require("../models/Place");
const User = require("../models/User");

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

export const verifyPlace = (req: Request, res: Response) => {
  const admin = req.cookies.jwtA;
  try {
    jwt.verify(
      admin,
      process.env.ADMIN_TOKEN,
      async (err: Error, decodedAdmin: any) => {
        if (err) {
          console.log("No permissions to verify place");
          return res
            .status(403)
            .send({ err: "You don't have permissions to verify places" });
        }
        let trustedEmail = false;
        console.log(process.env.ADMIN_EMAILS, process.env.JWT_TOKEN);
        JSON.parse(process.env.ADMIN_EMAILS).forEach((email) => {
          console.log(email, decodedAdmin.email);
          if (email === decodedAdmin.email) {
            trustedEmail = true;
          }
        });
        if (!trustedEmail) {
          return res.status(403).send({
            err: "Authorization failed - you don't have permissions for this action",
          });
        }
        const { placeId } = req.body;
        const place = await Place.findOne({ _id: placeId });
        console.log(place);
        const addingUserId = place.userId;
        place.verified = true;
        place.userId = ""; // teraz ustawiam na puste, poniewaz tutaj będzie oficjalne konto miejsca, jeśli będzie chciało
        await place
          .save() // aktualizowanie statusu miejsca na verified
          .then(async () => {
            const addingUserInfo = await User.findOne({ _id: addingUserId }); // dodawanie userowi za nagrodę darmową promocję eventu
            console.log(addingUserId, addingUserInfo);
            addingUserInfo.promotionEvents += 1;
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
                  msg: "Internal server error - place successfully added, but user promotion points do not increase - administrator will give them manually",
                });
              });
          })
          .catch((err: Error) => {
            console.log(`Cannot verify place: ${err}`);
            return res
              .status(500)
              .send({ msg: "Internal server error - cannot verify place" });
          });
      }
    );
  } catch (err) {
    console.log(err);
  }
};
