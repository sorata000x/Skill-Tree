import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase.js';
import './Login.css';
import { useStateValue } from './StateProvider.js';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase.js';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [{tasks, user}, dispatch] = useStateValue();

  const signIn = (e) => {
    e.preventDefault();

    // firebase login
    signInWithEmailAndPassword(auth, email, password)
    .then( auth => {

    })
    .catch(error => alert(error.message))
  }

  const register = (e) => {
    e.preventDefault();

    // firebase register
    createUserWithEmailAndPassword(auth, email, password)
      .then((auth) => {
        // successfully created a new user with email and password
        if (auth) {
          navigate('/')
        }
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className='login'>
      <div className="login_container">
        <h1>Sign-in</h1>
        <form>
          <h5>E-mail</h5>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h5>Password</h5>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            onClick={signIn}
            className="login_signInButton"
          >
            Sign In
          </button>
        </form>

        <button onClick={register} className="login__registerButton">
          Create Your Account
        </button>
      </div>
    </div>
  )
}

export default Login
