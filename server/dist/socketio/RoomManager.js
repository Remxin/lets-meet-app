"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoomManager {
    static setIo(io) {
        this.io = io;
    }
    static joinSocketToRoom(roomId, socket) {
        if (Array.isArray(roomId)) {
            roomId.forEach((room) => {
                console.log("joining to room", room);
                socket.join(room);
            });
            return;
        }
        else if (typeof roomId == "string")
            socket.join(roomId);
    }
}
console.log("Socket manager estabilished");
exports.default = RoomManager;
