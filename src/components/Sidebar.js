import React, { useState, useEffect } from "react";
import "../styles/Sidebar.css";
import { Avatar, IconButton, Button } from "@material-ui/core";
import DonutLargeOutlinedIcon from "@material-ui/icons/DonutLargeOutlined";
import InsertCommentOutlinedIcon from "@material-ui/icons/InsertCommentOutlined";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import SearchIcon from "@material-ui/icons/Search";
import SidebarChat from "./SidebarChat";
import { useStateValue } from "../StateProvider";
import db from "../firebase";

function Sidebar() {
  const [{ user }, dispatch] = useStateValue();
  const [rooms, setRoom] = useState([]);

  useEffect(() => {
    db.collection("rooms").onSnapshot((snapshot) =>
      setRoom(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
  }, [rooms]);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <h3>{user?.displayName}</h3>

        <div className="sidebar__headerButton">
          <IconButton>
            <DonutLargeOutlinedIcon />
          </IconButton>
          <IconButton>
            <InsertCommentOutlinedIcon />
          </IconButton>
          <IconButton>
            <MoreVertOutlinedIcon />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchIcon />
          <input type="text" placeholder="搜尋聊天室" />
          <Button type="submit" />
        </div>
      </div>

      <div className="sidebar__body">
        <SidebarChat addNewChat />
        {rooms?.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
