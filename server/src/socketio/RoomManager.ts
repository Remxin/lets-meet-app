import { IOType } from "child_process"

class RoomManager {
    static io: IOType

    static setIo(io: IOType) {
        this.io = io
    }

    static joinSocketToRoom(roomId: string | string[], socket: any) { // chat ID == room ID
        if (Array.isArray(roomId)) {
            roomId.forEach((room: string) => {
                socket.join(room)
            })
            return
        } else if (typeof roomId == "string") socket.join(roomId)
        
    }

}

console.log("Socket manager estabilished")

export default RoomManager