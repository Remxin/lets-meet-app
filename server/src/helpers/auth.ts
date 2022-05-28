const jwt = require("jsonwebtoken");

type adminType = {
  id: String,
  email: String
}
type verifyAdminResType = {
  err?: string,
  admin?: adminType
}

// ----- returnuje obiekt usera, gdy się uda, zwraca obiekt z err, jeśli się nie uda -----
export const verifyUser = (token: String) => {
  return new Promise((resolve, reject) => {
    try {
      if (token) {
        jwt.verify(token, process.env.JWT_TOKEN, (err: Error, user: any) => {
          if (err) {
            return resolve({ err });
          }
          resolve(user);
        });
      } else {
        reject({ err: "token is undefined" });
      }
    } catch (err) {
      reject({ err });
    }
  });
};

// ----- returnuje obiekt admina, jeśli się uda go zweryfikować, w przeciwnym wypadku wypluwa obiekt err -----
export const verifyAdmin = async (adminToken: String) => {
  return new Promise<verifyAdminResType>((resolve, reject) => {
    try {
      jwt.verify(
        adminToken,
        process.env.ADMIN_TOKEN,
        async (err: Error, decodedAdmin: any) => {
          if (err) {
            //@ts-ignore
            return resolve({ err });
          }
          if (!process.env.ADMIN_EMAILS) {
            return resolve({ err: "server cannot load admin list" });
          }
          // @ts-ignore
          const adminEmails = await JSON.parse(process.env.ADMIN_EMAILS);

          if (adminEmails.includes(decodedAdmin.email)) {
            const adminData = {
              id: decodedAdmin.id,
              email: decodedAdmin.email,
            };
            resolve({ admin: adminData });
          }
          resolve({ err: "admin is not verified" });
        }
      );
    } catch (err) {
      reject({ err });
    }
  });
};
