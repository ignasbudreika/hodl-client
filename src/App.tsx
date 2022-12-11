import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import jwt from 'jwt-decode'

import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { PubInvestmentCategories } from './pages/public/PubInvestmentCategories'
import { InvestmentCategories } from './pages/investment-categories/InvestmentCategories'
import { Brokers } from './pages/brokers/Brokers'
import { Investments } from './pages/investments/Investments'
import { selectAuth, useAppSelector } from './store';
import { Approved } from './pages/admin/Approved'
import { WaitingApproval } from './pages/admin/WaitingApproval'

const App: React.FC = () => {
  const auth = useAppSelector(selectAuth);

  return (
    <div>
      <BrowserRouter>
      <Navbar />
        <div className="container">
          <Switch>
            {/* <Route path="*" component={Home} /> */}
            <Route path="/" component={Home} exact />
            <Route path="/published" component={PubInvestmentCategories} />
            {auth.accessToken && (jwt((auth.accessToken)) as any).roles.includes('ROLE_USER') ? 
              <>
                <Route path="/portfolios" component={InvestmentCategories} />
                <Route path="/brokers" component={Brokers} />
                <Route path="/investments" component={Investments} />
              </> : auth.accessToken && (jwt((auth.accessToken)) as any).roles.includes('ROLE_ADMIN') ? 
              <>
                <Route path="/approved" component={Approved} />
                <Route path="/waiting-approval" component={WaitingApproval} />
              </> :
              <>
                <Route path="/login" component={Login} exact />
                <Route path="/register" component={Register} />
              </>
            }
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App
