import React from 'react';
import Homepage from './components/Homepage';
import About from './components/About';
import AllRoom from './components/AllRoom'
import Login from './components/Login';
import RoomInfoPage from './components/RoomInfoPage';
import Navbar from './components/Navbar';
import Appointment from './components/Appointment';
import CreateRoom from './components/CreateRoom';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { AuthenticationProvider } from './components/contexts/AuthenticationContext';
import { SnackbarProvider } from 'notistack';
import theme from './Theme/themeTypography';
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Router>
      <SnackbarProvider>
        <AuthenticationProvider>
          <Navbar />
          <ThemeProvider theme={theme}>
            <Switch>
              <Route exact path="/" component={Homepage} />
              <Route exact path="/about" component={About} />
              <Route exact path="/room" component={AllRoom} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/room/create" component={CreateRoom} />
              <Route exact path="/room/:id" component={RoomInfoPage} />
              <Route exact path="/room/:roomId/service/:serviceId/appointment" component={Appointment} />
            </Switch>
          </ThemeProvider>
        </AuthenticationProvider>
      </SnackbarProvider>
    </Router>
  )
}

export default App