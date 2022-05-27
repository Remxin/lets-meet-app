import axios from "axios";

export const placeLink = (placeId:String, placeIndex: String) => {
    return `${process.env.REACT_APP_SERVER_IP}/get/place/img?placeId=${placeId}&photoIndex=${placeIndex}`
}