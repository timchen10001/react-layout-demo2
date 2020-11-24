import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import "../styles/SidebarChat.css";
import db from "../firebase";

function SidebarChat({ id, name, addNewChat = false }) {
  const [seed, setSeed] = useState();
  const [message, setMessage] = useState([]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const createNewRoom = () => {
    const roomName = prompt("請輸入欲新建之聊天室名稱");
    db.collection("rooms")
      .add({
        name: roomName,
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessage(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/male/${seed}.svg`} />
        <div className="sidebarChat__info">
          <h3>{name}</h3>
          <p>{message[0]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createNewRoom} className="addNewChat">
      <h3>新建聊天室</h3>
    </div>
  );
}

export default SidebarChat;
