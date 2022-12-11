import React, { Fragment } from 'react'
import { FormControl, Input, InputLabel, Button } from '@material-ui/core'
import AuthService from '../services/AuthService'
import { useHistory } from 'react-router-dom';
import { useState } from 'react';

export const Register: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');

  const registerUser = () => {
    if (!username || !password || !passwordConfirmation) {
      return;
    }

    AuthService.registerUser(username, password, passwordConfirmation).then((response) => {
      if (response.status === 204) {
        setUsername('');
        setPassword('');
        setPasswordConfirmation('');
        history.push('/');
      }
    })
  }

  return (
    <Fragment>
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{width: '30%'}}>
      <h3 style={{display: 'inline-block'}}>H</h3>
      <h4 style={{display: 'inline-block'}}>old</h4>
      <h3 style={{display: 'inline-block'}}>O</h3>
      <h4 style={{display: 'inline-block'}}> n for</h4>
      <h3 style={{display: 'inline-block'}}>D</h3>
      <h4 style={{display: 'inline-block'}}>ear</h4>
      <h3 style={{display: 'inline-block'}}>L</h3>
      <h4 style={{display: 'inline-block'}}>ife</h4>
      <form>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="username">
                username
              </InputLabel>
              <Input
                name="username"
                type={"text"}
                autoComplete="username"
                disableUnderline={true}
                onChange={uname => setUsername(uname.target.value)}
              />
            </FormControl>

            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="password">
                password
              </InputLabel>
              <Input
                name="password"
                autoComplete="password"
                disableUnderline={true}
                type={"password"}
                onChange={pw => setPassword(pw.target.value)}
              />
            </FormControl>

            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="passwordConfirm">
                confirm password
              </InputLabel>
              <Input
                name="passwordConfirm"
                autoComplete="passwordConfrim"
                disableUnderline={true}
                type={"password"}
                onChange={pwConfirm => setPasswordConfirmation(pwConfirm.target.value)}
              />
            </FormControl>
            <Button
              disableRipple
              variant="contained"
              fullWidth
              onClick={() => registerUser()}
            >
              Register
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  )
}
