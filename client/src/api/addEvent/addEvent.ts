import axios from "axios";

type PromiseType = {
  msg?: String,
  err?: String
}

export const addEvent = (eventName: String, isPublic: boolean, premiumEvent: boolean, membersRestrictions: boolean, place: String, city: String, eventDescription: String, openChat: boolean, file: any = null, fileSrc: string = "", maxMembers: number = -1, date:number) => {
  console.log(eventName, isPublic, premiumEvent, membersRestrictions, place, city, eventDescription, openChat, file)

    return new Promise<PromiseType>(async (resolve, reject) => {
        try {
            const formData = new FormData();
            formData.append(
              "jsondataRequest",
              JSON.stringify({
                eventName,
                isPublic,
                premiumEvent,
                membersRestrictions,
                place,
                city,
                eventDescription,
                openChat,
                fileSrc,
                maxMembers,
                date
              })
            );
            formData.append("file", file);

            const res = await axios.post(
              `${process.env.REACT_APP_SERVER_IP}/create/event`,
              formData,
              {
                withCredentials: true,
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            const resData = await res.data;
            console.log(res.data);
            resolve(resData)
            // --- start fetching ---
        } catch (err) {
            reject({err})
        }
    })
}