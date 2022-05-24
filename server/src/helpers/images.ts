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
            if (files.length - 1 < index) {
                resolve({err: "Bad index"})
            }
            resolve({path: dir + "/" + files[index]})
        } catch(err) {
            reject({err})
        }
    })
}
