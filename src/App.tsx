import "./App.css";
import React, { useEffect, useState } from "react";
import { useStateValue } from "./StateProvider";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { db, auth } from "./firebase.ts";
import { doc, getDoc } from "firebase/firestore";
import { MainPage } from "MainPage";
import { ViewOnlyTreePage } from "ViewOnlyTreePage/ViewOnlyTreePage.tsx";

/**
 * Main functionalities
 * - Route to different pages
 * - Handle authentication (set user)
 * - Set user data
 */
function App() {
  const [{ user, theme }, dispatch] = useStateValue();
  // Render after data loaded
  // Reference: https://stackoverflow.com/questions/51556988/react-render-component-asynchronously-after-data-is-fetched
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`pathParam App: ${window.location.search}`)
  }, []);

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
        setLoading(false);
      }
    });
  }, []);

  // Get user data
  useEffect(() => {
    const getUserData = async () => {
      // @ts-ignore
      let userDoc = await getDoc(doc(db, "users", user?.uid));
      if (userDoc.data()) {
        dispatch({
          type: "SET_SKILLS",
          skills: JSON.parse(
            userDoc.data()?.skills ? userDoc.data()?.skills : "[]"
          ),
        });
        dispatch({
          type: "SET_GROUPS",
          groups: JSON.parse(
            userDoc.data()?.groups ? userDoc.data()?.groups : "[]"
          ),
        });
        if (userDoc.data()?.groups && userDoc.data()?.groups.length) {
          dispatch({
            type: "SET_ACTIVE_GROUP",
            id: userDoc.data()?.groups[0].id,
          });
        }
        dispatch({
          type: "SET_THEME",
          theme: userDoc.data()?.theme,
        });
      }
      setLoading(false);
    };
    if (user) {
      getUserData();
    }
  }, [user]);

  if (isLoading) return;

  return (
    <div className={`App ${theme}`}>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/share" element={<ViewOnlyTreePage />} />
          <Route path={`/:pathParam?`} element={<MainPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
