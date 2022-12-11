import React, { Fragment, useState } from 'react'
import { FormControl, Input, InputLabel, Button } from '@material-ui/core'
import axios from 'axios'

export const Login: React.FC = () => {
  const [usernameError, setUsernameError] = useState({});
  const [passwordError, setPasswordError] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const errors = {
    username: "invalid username",
    password: "invalid password"
  };

  const renderErrorMessage = (name: string) => {
    if (name === "username") {
      <div className="error">{usernameError}</div>
    } else if (name === "password") {
      <div className="error">{passwordError}</div>
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    // Prevent page reload
    e.preventDefault();

    if (username.length == 0) {
      setUsernameError(errors.username);
    }

    if (password.length == 0) {
      setPasswordError(errors.password);
    }

    return axios
      .post("http://localhost:8080/api/login", {
        username,
        password
      });
  };

  return (
    <Fragment>
      <h1>HODL</h1>
      <form onSubmit={handleSubmit}>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="username">
                username
              </InputLabel>
              <Input
                name="username"
                type="username"
                autoComplete="username"
                disableUnderline={true}
                required={true}
                onChange={e => setUsername(e.target.value)}
              />
              {renderErrorMessage("username")}
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
                required={true}
                onChange={e => setPassword(e.target.value)}
              />
              {renderErrorMessage("password")}
            </FormControl>

            <Button
              disableRipple
              fullWidth
              variant="outlined"
              type="submit"
            >
              Log in
            </Button>
          </form>
    </Fragment>
  )
}
