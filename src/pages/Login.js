import React from "react";
import "../styles/Login.css";
import { useStateValue } from "../StateProvider";
import { Button } from '@material-ui/core';
import { auth, provider } from '../firebase';
import { actionTypes } from '../reducers/reducer';

function Login() {
  const [{}, dispatch] = useStateValue();

  const signIn = () => {
    auth.signInWithPopup(provider)
    .then(result => {
        dispatch({
            type: actionTypes.SET_USER,
            user: result.user,
        })
    })
    .catch(error => console.log(error))
  };

  return (
    <div className="login">
      <div className="login__body">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/597px-WhatsApp.svg.png"
          alt=""
        />
        <h1>登入 WhatsApp</h1>
        <h3>Cloned By 陳宜庭</h3>
        <Button tpye='submit' onClick={signIn}>使用 Google 驗證登入</Button>
      </div>
    </div>
  );
}

export default Login;
