"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = exports.verifyUser = void 0;
const jwt = require("jsonwebtoken");
// ----- returnuje obiekt usera, gdy się uda, zwraca obiekt z err, jeśli się nie uda -----
const verifyUser = (token) => {
    return new Promise((resolve, reject) => {
        try {
            if (token) {
                jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
                    if (err) {
                        return resolve({ err });
                    }
                    resolve(user);
                });
            }
            else {
                reject({ err: "token is undefined" });
            }
        }
        catch (err) {
            reject({ err });
        }
    });
};
exports.verifyUser = verifyUser;
// ----- returnuje obiekt admina, jeśli się uda go zweryfikować, w przeciwnym wypadku wypluwa obiekt err -----
const verifyAdmin = (adminToken) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(adminToken, process.env.ADMIN_TOKEN, (err, decodedAdmin) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    //@ts-ignore
                    return resolve({ err });
                }
                if (!process.env.ADMIN_EMAILS) {
                    return resolve({ err: "server cannot load admin list" });
                }
                // @ts-ignore
                const adminEmails = yield JSON.parse(process.env.ADMIN_EMAILS);
                if (adminEmails.includes(decodedAdmin.email)) {
                    const adminData = {
                        id: decodedAdmin.id,
                        email: decodedAdmin.email,
                    };
                    resolve({ admin: adminData });
                }
                resolve({ err: "admin is not verified" });
            }));
        }
        catch (err) {
            reject({ err });
        }
    });
});
exports.verifyAdmin = verifyAdmin;
