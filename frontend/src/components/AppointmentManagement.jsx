import React, { useEffect, useCallback, useState, useContext } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext'
import AppointmentView from './AppointmentView';
import Container from '@material-ui/core/Container'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { TabPanel, a11yProps } from './Tabpanel'
import axios from 'axios'

function AppointmentManagement() {
    const auth = useContext(AuthenticationContext)
    const [state, setState] = useState({
        room: "",
        rooms: [],
        tab: 0
    })

    const handleSwitch = (event, newValue) => {
        setState(prevState => { return { ...prevState, tab: newValue } })
    };

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(`/api/user/${auth.state.uid}/room`, { headers: { 'x-auth-token': window.localStorage.getItem('token') } })
            setState(prevState => { return { ...prevState, rooms: res.data.room } })
            console.log(res.data)
        } catch (err) {
            console.log(err)
        }
    }, [auth.state.uid])




    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <Container>
            <Tabs
                variant="scrollable"
                value={state.tab}
                name="tab"
                onChange={handleSwitch}
            >
                {state.rooms.map((el, i) =>
                    <Tab label={el.title} key={i}  {...a11yProps(i)} />
                )}
            </Tabs>
            {state.rooms.map((el, i) =>
                <TabPanel value={state.tab} index={i} key={i}>
                    <AppointmentView
                        services={el.services}
                        roomId={el._id}
                        openingTime={el.openingTime}
                        closingTime={el.closingTime}
                        openWeekday={el.openWeekday}
                    />
                </TabPanel>
            )}
        </Container>
    )
}

export default AppointmentManagement