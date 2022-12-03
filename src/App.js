import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import RotateLoader
from "react-spinners/RotateLoader";
import ChatPage from "./components/ChatPage/ChatPage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import { setUser, clearUser } from "./redux/actions/user_action";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useDispatch, useSelector } from "react-redux";

function Loading() {
  return (
    <div className="contentWrap">
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <RotateLoader
          color="#5ABEF5"
          height={15}
          width={5}
          radius={2}
          margin={2}
        />
      </div>
    </div>
  );
}

function App(props) {
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/"); //    /login 말고 "/" 으로 나중에 바꾸세요
        dispatch(setUser(user));

        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // ...
      } else {
        navigate("/login");
        dispatch(clearUser());
        // User is signed out
        // ...
      }
    });
  }, []);
  
    if (isLoading) {
      return <div><Loading/></div>;
    } else {
      return (
        
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      );
    }
  }


export default App;
