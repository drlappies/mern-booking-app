import React from 'react'
import Homepage from './components/Homepage';
import About from './components/About';
import AllRoom from './components/AllRoom'
import Register from './components/Register';
import RoomInfoPage from './components/RoomInfoPage';
import Navbar from './components/Navbar';
import Appointment from './components/Appointment';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './Theme/themeTypography';
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Router>
      <Navbar />
      <ThemeProvider theme={theme}>
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/about" component={About} />
          <Route exact path="/room" component={AllRoom} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/room/:id" component={RoomInfoPage} />
          <Route exact path="/room/:roomId/service/:serviceId/appointment" component={Appointment} />
        </Switch>
      </ThemeProvider>
    </Router>
  )
}

export default App