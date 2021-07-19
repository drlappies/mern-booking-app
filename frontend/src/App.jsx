import React from 'react';
import Homepage from './components/Homepage';
import About from './components/About';
import AllRoom from './components/AllRoom'
import Login from './components/Login';
import RoomInfoPage from './components/RoomInfoPage';
import Navbar from './components/Navbar';
import Appointment from './components/Appointment';
import CreateRoom from './components/CreateRoom';
import Register from './components/Register';
import Confirmation from './components/Confirmation';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { AuthenticationProvider } from './components/contexts/AuthenticationContext';
import { AppointmentProvider } from './components/contexts/AppointmentContext';
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
              <AppointmentProvider>
                <Route exact path="/room/:roomId/service/:serviceId/appointment" component={Appointment} />
                <Route exact path="/room/:roomId/service/:serviceId/appointment/confirmation" component={Confirmation}/>
              </AppointmentProvider>
              <Route exact path="/register" component={Register} />
            </Switch>
          </ThemeProvider>
        </AuthenticationProvider>
      </SnackbarProvider>
    </Router>
  )
}

export default App