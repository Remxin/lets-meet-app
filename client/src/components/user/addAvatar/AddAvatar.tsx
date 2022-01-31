import axios from "axios";
import React, { useState } from "react";

const AddAvatar = () => {
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [fileName, setFileName] = useState("Select file");
  const [file, setFile] = useState("");

  const addFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      //@ts-ignore
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const submitHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
    setErr("");
    const formData = new FormData();
    formData.append("file", file);
    //@ts-ignore
    for (let key of formData.entries()) {
      console.log(key[0] + ", " + key[1].name);
    }

    try {
      if (!!file) {
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
          return setErr(res.data.err);
        }
        return setMsg(res.data.msg);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={submitHandler} encType="multipart/form-data">
      <p>Choose your avatar picture</p>
      <input type="file" onChange={addFile} />
      <button type="submit">Add avatar</button>
      <p>{err}</p>
      <p>{msg}</p>
    </form>
  );
};

export default AddAvatar;
