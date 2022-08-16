import axios from "axios";
export const addAvatar = (file: File) => {
    return new Promise(async (resolve, reject) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_SERVER_IP}/send/user/avatar`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                  withCredentials: true,
                }
              );
              if (res.data?.err) {
                return resolve({err: res.data.err});
              }
              return resolve({msg: "success"});
        } catch (err) {
            reject({ err })
        }
    })
}