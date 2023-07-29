import "./App.css";
import React, { useEffect } from "react";
import { useStateValue } from "./StateProvider";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import Skill from "./SkillTree/Skill";
import { db, auth } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

function App() {
  const [{ user }, dispatch] = useStateValue();
  const urlParam = useParams().pathParam;

  useEffect(() => {
    // Set app name
    document.title = "Skill Tree";
    // Set user
    auth.onAuthStateChanged(async (authUser) => {
      console.log("THE USER IS >>> ", authUser);
      if (authUser) {
        // the user just logged in / the user was logged in
        localStorage.clear();
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        // the user is logged out
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
    // Set active group
    dispatch({
      type: "SET_ACTIVE_GROUP",
      id: urlParam,
    })
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      let userDoc = await getDoc(doc(db, "users", user?.uid));
      if (userDoc.data()) {
        dispatch({
          type: "SET_SKILLS",
          skills: JSON.parse(
            userDoc.data().skills ? userDoc.data().skills : "[]"
          ),
        });
        dispatch({
          type: "SET_GROUPS",
          groups: JSON.parse(
            userDoc.data().groups ? userDoc.data().groups : "[]"
          ),
        });
        if (userDoc.data().groups && userDoc.data().groups.length) {
          dispatch({
            type: "SET_ACTIVE_GROUP",
            activeGroup: userDoc.data().groups[0],
          })
        }
      }
    };
    if (user) {
      getUserData();
    }
  }, [user]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Skill />} />
          <Route path={`/:pathParam?`} element={<Skill />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
