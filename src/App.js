import './App.css';
import React, { useEffect } from 'react';
import { useStateValue } from './StateProvider';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Skill from './SkillTree/Skill';
import Login from './Login';
import { db, auth } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  const [{user}, dispatch] = useStateValue();

  useEffect(() => {
    // Set user
    auth.onAuthStateChanged(async authUser => {
      console.log('THE USER IS >>> ', authUser);
      if(authUser) {
        // the user just logged in / the user was logged in
        localStorage.clear();
        dispatch({
          type: 'SET_USER',
          user: authUser
        })
      } else {
        // the user is logged out
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }
    })
  }, [])

  useEffect(() => {
    const getUserData = async () => {
      let userDoc = await getDoc(doc(db, "users", user?.uid))
      if (userDoc.data()) {
        dispatch({
          type: 'SET_SKILLS',
          skills: JSON.parse(userDoc.data().skills)
        })
        dispatch({
          type: 'SET_GROUPS',
          groups: JSON.parse(userDoc.data().groups)
        })
      }
    }
    if (user) {
      getUserData();
    }
  }, [user])

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Skill />
            }
          />
          <Route
            path={`/:pathParam?`}
            element={
              <Skill />
            }
          />
          <Route
            path="/login"
            element={
              <Login />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
