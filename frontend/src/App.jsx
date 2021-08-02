import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { AuthenticationProvider } from './components/contexts/AuthenticationContext';
import { AppointmentProvider } from './components/contexts/AppointmentContext';
import theme from './Theme/themeTypography';
import { ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import Homepage from './components/Homepage';
import About from './components/About';
import Catalog from './components/Catalog'
import Login from './components/Login';
import RoomInfoPage from './components/RoomInfoPage';
import Navbar from './components/Navbar';
import Appointment from './components/Appointment';
import CreateRoom from './components/CreateRoom';
import Register from './components/Register';
import RegisterRoomowner from './components/RegisterRoomowner';
import RoomManagement from './components/RoomManagement'
import RegisterRoomfinder from './components/RegisterRoomfinder';
import Confirmation from './components/Confirmation';
import Payment from './components/Payment';
import User from './components/User';
import Transaction from './components/Transaction'
import Record from './components/Record'
import RecordSearch from './components/RecordSearch'
import './App.css'

function App() {
  return (
    <Router>
      <SnackbarProvider>
        <AuthenticationProvider>
          <AppointmentProvider>
            <Navbar />
            <ThemeProvider theme={theme}>
              <Switch>
                <Route exact path="/" component={Homepage} />
                <Route exact path="/about" component={About} />
                <Route exact path="/room" component={Catalog} />
                <Route exact path="/user" component={User} />
                <Route exact path="/user/login" component={Login} />
                <Route exact path="/user/record" component={Transaction} />
                <Route exact path="/user/register" component={Register} />
                <Route exact path="/user/register/roomfinder" component={RegisterRoomfinder} />
                <Route exact path="/user/register/roomowner" component={RegisterRoomowner} />
                <Route exact path="/management" component={RoomManagement} />
                <Route exact path="/appointment" component={Record} />
                <Route exact path="/appointment/search" component={RecordSearch} />
                <Route exact path="/room/create" component={CreateRoom} />
                <Route exact path="/room/:id" component={RoomInfoPage} />
                <Route exact path="/room/:roomId/service/:serviceId/appointment" component={Appointment} />
                <Route exact path="/room/:roomId/service/:serviceId/appointment/confirmation" component={Confirmation} />
                <Route exact path="/room/:roomId/service/:serviceId/appointment/payment" component={Payment} />
              </Switch>
            </ThemeProvider>
          </AppointmentProvider>
        </AuthenticationProvider>
      </SnackbarProvider>
    </Router>
  )
}

export default App