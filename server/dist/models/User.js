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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Enter your name"],
    },
    email: {
        type: String,
        required: [true, "Enter your email"],
        unique: true,
        validate: [isEmail, "Enter a valid email address"],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Enter password"],
        minlength: [6, "Password should be at least 6 characters long"],
    },
    sex: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    premium: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        required: true,
        default: "user",
    },
    promotionEvents: {
        type: Number,
        default: 0,
    },
});
//@ts-ignore
// userSchema.pre("save", async function (next: NextFunction) {
//   // wykona się przed zapisaniem do bazy danych
//   const salt = await bcrypt.genSalt(); // generuje dodatkowe zbędne znaki
//   // @ts-ignore
//   this.password = await bcrypt.hash(this.password, salt); // hashuje hasło z dodatkowymi znakami
//   next();
// });
userSchema.statics.register = function ({ email, password, name, sex, age }) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt.genSalt();
        const hashedPass = yield bcrypt.hash(password, salt);
        try {
            const user = yield this.create({ email, password: hashedPass, name, sex, age });
            return user;
        }
        catch (err) {
            throw Error("Internal server error");
        }
    });
};
userSchema.statics.login = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        // creating own function to the schema
        const user = yield this.findOne({ email });
        if (user) {
            const isAuthenticated = yield bcrypt.compare(password, user.password);
            if (isAuthenticated) {
                return user;
            }
            else {
                throw Error("incorrect password");
            }
        }
        else {
            throw Error("incorrect email");
        }
    });
};
const User = mongoose_1.default.model("user", userSchema);
module.exports = User;
