const fs = require("fs")
const path = require("path")

export const getPlaceImageLength = (imageId: String) =>{
    return new Promise((resolve, reject) => {
        try {
            const dir = path.join(__dirname, "/../static/uploads/places/" + imageId);
            const files = fs.readdirSync(dir);
            resolve(files.length)
        } catch (err) {
            reject({err})
        }
      
    })
}

export const getPlaceImage = (index: number, imageId: String) => {
    return new Promise((resolve, reject) => {
        try {
            const dir = path.join(__dirname, "/../static/uploads/places/" + imageId);
            const files = fs.readdirSync(dir)
            console.log(files.length - 1, +index)
            if (+index > files.length - 1 ) {
                resolve({err: "Bad index"})
            }
            resolve({path: dir + "/" + files[index]})
        } catch(err) {
            reject({err})
        }
    })
}

export const deletePlaceImageFolder = (imageId: String) => {
    return new Promise<{err?: String, msg?:String}>(async (resolve, reject) => {
        try {
            await fs.rmSync(path.join(__dirname, "/../static/uploads/places/", imageId), { recursive: true, force: true })
            resolve({ msg: "Successfully deleted folder" })
        } catch (err) {
            reject({err})
        }
    })
}

export const saveImage = (image: any, imageLocation: string) => {
    return new Promise((resolve, reject) => {
        try {
            image.mv(imageLocation, (err: Error) => {
                if (err) resolve({ err })
                resolve({msg: "success"})
            })
        } catch (err) {
            reject({ err })
        }
    })
}
