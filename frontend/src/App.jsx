import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { AuthenticationProvider } from './components/contexts/AuthenticationContext';
import { AppointmentProvider } from './components/contexts/AppointmentContext';
import theme from './Theme/themeTypography';
import { ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import Homepage from './components/Homepage';
import About from './components/About';
import AllRoom from './components/AllRoom'
import Login from './components/Login';
import RoomInfoPage from './components/RoomInfoPage';
import Navbar from './components/Navbar';
import Appointment from './components/Appointment';
import CreateRoom from './components/CreateRoom';
import Register from './components/Register';
import RegisterRoomowner from './components/RegisterRoomowner';
import RegisterRoomfinder from './components/RegisterRoomfinder';
import Confirmation from './components/Confirmation';
import Payment from './components/Payment';
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
              <Route exact path="/register" component={Register} />
              <Route exact path="/register/roomfinder" component={RegisterRoomfinder} />
              <Route exact path="/register/roomowner" component={RegisterRoomowner} />
              <AppointmentProvider>
                <Route exact path="/room/:roomId/service/:serviceId/appointment" component={Appointment} />
                <Route exact path="/room/:roomId/service/:serviceId/appointment/confirmation" component={Confirmation} />
                <Route exact path="/room/:roomId/service/:serviceId/appointment/payment" component={Payment} />
              </AppointmentProvider>
            </Switch>
          </ThemeProvider>
        </AuthenticationProvider>
      </SnackbarProvider>
    </Router>
  )
}

export default App