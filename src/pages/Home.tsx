import React, { Fragment, useEffect } from 'react'
import { login, useAppDispatch } from '../store';
import { useHistory } from 'react-router-dom';
import AuthService from '../services/AuthService';

export const Home: React.FC = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  useEffect(() => {
    var queryParams = new URLSearchParams(window.location.search)
    var code = queryParams.get("code")

    if (code && code.length > 0) {
      AuthService.retrieveAccessTokenFromAuthenticationCode(code)
      .then((res) => {
        dispatch(login({refreshToken: res.data.refresh_token,accessToken: res.data.access_token}))
        history.push('/')
      })
    }
  }, []);

  return (
    <Fragment>
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{width: '50%'}}>
          <h4><b>HODL</b> is an all-in-one solution for tracking your investments</h4>
          <hr></hr>
          <p>
            HODL is a term derived from a misspelling of "hold," in the context of buying and holding Bitcoin and other cryptocurrencies. 
            <br></br>
            It's also commonly come to stand for "hold on for dear life" among crypto investors.      
            <br></br>
            Though it can be applied to any type of investment and in short means focusing on long-term investing plans rather than the distraction of short-term gains or losses.
          </p>
          <p>
            <b>What this platform offers?</b>
            <br></br>
            Easily manage your investment categories, split your investments based on different brokerages that you use and gain updated data about how your stock and cryptocurrency investments are performing.
          </p>
          <img width='100%' height='undefined' src={'./hodl-main.png'} alt="investing" />
        </div>
      </div>
    </Fragment>
  )
}
