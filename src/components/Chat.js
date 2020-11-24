import React, { useState, useEffect } from "react";
import "../styles/Chat.css";
import { Link, useParams, useHistory } from "react-router-dom";
import { Avatar, IconButton } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AttachmentIcon from "@material-ui/icons/Attachment";
import VerticalAlignTopIcon from "@material-ui/icons/VerticalAlignTop";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import SendIcon from "@material-ui/icons/Send";
import db from "../firebase.js";
import firebase from "firebase";
import { useStateValue } from "../StateProvider";

function Chat() {
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState();
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [datas, setDatas] = useState([]);
  const [chatBody, setChatBody] = useState();
  const [list, setList] = useState();

  const scrollTo = (option = "bottom") => {
    if (chatBody) {
      switch (option) {
        case "bottom":
          chatBody.scrollTop = chatBody.scrollHeight;
          break;
        case "top":
          chatBody.scrollTop = 0;
          break;

        default:
          chatBody.scrollTop = chatBody.scrollHeight;
      }
    }
  };

  const sendMessages = (e) => {
    e.preventDefault();

    console.log("You typing >>>", input);

    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    scrollTo("bottom");

    setInput("");
  };

  const displayChats = () => {
    list.classList.toggle("hide");
  };

  const history = useHistory();
  

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
      db.collection("rooms").onSnapshot((snapshot) =>
        setDatas(snapshot.docs.map((doc) => doc))
      );
    }

    setChatBody(document.querySelector(".chat__body"));
    setList(document.querySelector(".chat__list"));
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);



  setTimeout(() => {
    scrollTo("bottom");
    if (!roomId)
      history.push('/rooms/AbwGzG384sHLCddxI7I2')
  }, 400);

  return (
    <div className="chat">
      <div className="chat__header">
        <div className="chat__headerInfo">
          <Avatar src={user?.photoURL} />

          <p className="chat__headerName">
            {roomName}
            {messages[messages.length - 1]?.timestamp ? (
              <span>
                最後留言於{" "}
                {new Date(
                  messages[messages.length - 1]?.timestamp?.toDate()
                ).toLocaleDateString() +
                  " " +
                  new Date(
                    messages[messages.length - 1]?.timestamp?.toDate()
                  ).toLocaleTimeString()}
              </span>
            ) : (
              <span>尚無留言</span>
            )}
          </p>
        </div>

        <div className="chat__headerRight">
          <IconButton onClick={() => scrollTo("top")}>
            <VerticalAlignTopIcon />
          </IconButton>
          <IconButton>
            <AttachmentIcon />
          </IconButton>
          <IconButton onClick={displayChats}>
            <ExpandMoreIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat__list hide">
        <div className="chat__listContainer">
          {datas?.map((data) => (
            <Link to={`/rooms/${data.id}`} onClick={displayChats}>
              <h1>{data.data().name}</h1>
            </Link>
          ))}
        </div>
      </div>

      <div className="chat__body">
        {messages?.map((message) => (
          <p
            className={`chat__message ${
              message.name === user?.displayName && "chat__reciever"
            }`}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date(message.timestamp?.toDate()).toLocaleTimeString()}
            </span>
          </p>
        ))}
        {/* <div className="chat__dummy hide">Hi</div> */}
      </div>

      <form className="chat__footer">
        <IconButton>
          <SentimentVerySatisfiedIcon />
        </IconButton>
        <input
          value={input}
          type="text"
          placeholder="輸入訊息"
          onChange={(e) => setInput(e.target.value)}
        />
        <IconButton type="submit" onClick={sendMessages}>
          <SendIcon />
        </IconButton>
      </form>
    </div>
  );
}

export default Chat;
