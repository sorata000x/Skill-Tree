import React, { useState } from 'react';
import './UserAuthDialog.css';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.js';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function UserAuthDialog({open, close}) {
  const [type, setType] = useState('login');

  const signIn = (e) => {
    e.preventDefault();
    // firebase login
    // Reference: Get form data in React | https://stackoverflow.com/questions/23427384/get-form-data-in-react
    signInWithEmailAndPassword(auth, e.target.email.value, e.target.password.value)
    .then( auth => {
      close();
    })
    .catch(error => alert(error.message))
  }

  const register = (e) => {
    e.preventDefault();
    // firebase register
    createUserWithEmailAndPassword(auth, e.target.email.value, e.target.password.value)
      .then((auth) => {
        // successfully created a new user with email and password
        if (auth) {
          close();
        }
      })
      .catch((error) => alert(error.message));
  };

  return (
    <Dialog 
      open={open} 
      close={close} 
      maxWidth='100vw'>
      <div className='dialog_container'>
        <DialogTitle> 
          { type === 'login' ? 
          'Wecome Back' :
          'Create Your Account'}
        </DialogTitle>
        <form 
          className='dialog_form'
          onSubmit={type === 'login' ? signIn : register}>  
          <div className='dialog_context'>
            <TextField
              name="email" 
              variant="outlined"
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              size="small"
              fullWidth
            />
            <TextField
              name="password" 
              variant="outlined"
              autoFocus
              margin="dense"
              label="Password"
              type="password"
              size="small"
              fullWidth
            />
            <DialogContentText
              style={{marginTop: '10px'}}>
              { type === 'login' ? 
                `Don't have an account?` :
                `Already have an account?`
              }
              { type === 'login' ? 
                <button 
                  className='text_btn'
                  onClick={()=>setType('sign-up')}> 
                  Sign Up
                </button>:
                <button 
                  className='text_btn'
                  onClick={()=>setType('login')}> 
                  Login
                </button>
              }
            </DialogContentText>
          </div>
          <DialogActions>
            <Button 
              type="submit"
              variant='contained'>
              OK
            </Button>
            <Button 
              variant='outlined' 
              onClick={close}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </div>
    </Dialog>
  )
}

export default UserAuthDialog
