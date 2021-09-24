import React, { useEffect, useCallback, useState, useContext } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext'
import { useSnackbar } from 'notistack';
import AppointmentView from './AppointmentView';
import Noroom from './Noroom'
import Container from '@material-ui/core/Container'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { TabPanel, a11yProps } from './Tabpanel'
import axios from 'axios'

function AppointmentManagement() {
    const auth = useContext(AuthenticationContext)
    const { enqueueSnackbar } = useSnackbar();
    const [state, setState] = useState({
        isFetching: true,
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
            setState(prevState => { return { ...prevState, rooms: res.data.room, isFetching: false } })
        } catch (err) {
            enqueueSnackbar(err.response.data.error, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
        }
    }, [auth.state.uid, enqueueSnackbar])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    if (state.isFetching) {
        return null
    }

    if (state.rooms.length <= 0) {
        return <Noroom block={"預訂管理"} />
    }

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