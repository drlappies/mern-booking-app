import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { AuthenticationProvider } from './components/contexts/AuthenticationContext';
import { AppointmentProvider } from './components/contexts/AppointmentContext';
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
import RecordSearch from './components/RecordSearch'
import OwnerRoute from './components/OwnerRoute'
import FinderRoute from './components/FinderRoute';
import Notfound from './components/Notfound';
import ServiceManagement from './components/ServiceManagement';
import AppointmentManagement from './components/AppointmentManagement'
import './App.css'

function App() {
  return (
    <Router>
      <SnackbarProvider>
        <AuthenticationProvider>
          <AppointmentProvider>
            <Navbar />
            <Switch>
              <Route exact path="/" component={Homepage} />
              <Route exact path="/about" component={About} />
              <Route exact path="/room" component={Catalog} />
              <Route exact path="/user" component={User} />
              <Route exact path="/user/login" component={Login} />
              <FinderRoute exact path="/user/invoice" component={Transaction} />
              <Route exact path="/user/register" component={Register} />
              <Route exact path="/user/register/roomfinder" component={RegisterRoomfinder} />
              <Route exact path="/user/register/roomowner" component={RegisterRoomowner} />
              <OwnerRoute exact path="/room/management" component={RoomManagement} />
              <OwnerRoute exact path="/service/management" component={ServiceManagement} />
              <OwnerRoute exact path="/appointment/management" component={AppointmentManagement} />
              <OwnerRoute exact path="/appointment/search" component={RecordSearch} />
              <OwnerRoute exact path="/room/create" component={CreateRoom} />
              <Route exact path="/room/:id" component={RoomInfoPage} />
              <FinderRoute exact path="/room/:roomId/service/:serviceId/appointment" component={Appointment} />
              <FinderRoute exact path="/room/:roomId/service/:serviceId/appointment/confirmation" component={Confirmation} />
              <FinderRoute exact path="/room/:roomId/service/:serviceId/appointment/payment" component={Payment} />
              <Route exact path="*" component={Notfound} />
            </Switch>
          </AppointmentProvider>
        </AuthenticationProvider>
      </SnackbarProvider>
    </Router>
  )
}

export default App