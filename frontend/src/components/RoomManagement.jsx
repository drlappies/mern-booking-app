import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useSnackbar } from 'notistack';
import { AuthenticationContext } from './contexts/AuthenticationContext'
import { TabPanel, a11yProps } from './Tabpanel'
import Roomview from './Roomview';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import axios from 'axios'
import Noroom from './Noroom'
import Container from '@material-ui/core/Container'

function RoomManagement() {
    const { enqueueSnackbar } = useSnackbar();
    const auth = useContext(AuthenticationContext)
    const [state, setState] = useState({
        isFetching: true,
        room: [],
        tab: 0,
    })

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/api/user/${auth.state.uid}/room`, { headers: { 'x-auth-token': window.localStorage.getItem('token') } })
            setState(prevState => { return { ...prevState, room: res.data.room, isFetching: false } })
        } catch (err) {
            enqueueSnackbar(err.response.data.error, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
        }
    }, [auth.state.uid, enqueueSnackbar])

    const handleSwitch = (event, newValue) => {
        setState(prevState => { return { ...prevState, tab: newValue } })
    };

    useEffect(() => {
        fetchData()
    }, [fetchData])

    if (state.isFetching) {
        return null
    }

    if (state.room.length <= 0) {
        return <Noroom block={"房間管理"} />
    }

    return (
        <Container>
            <Tabs
                variant="scrollable"
                value={state.tab}
                name="tab"
                onChange={handleSwitch}
            >
                {state.room.map((el, i) =>
                    <Tab label={el.title} key={i}  {...a11yProps(i)} />
                )}
            </Tabs>
            {state.room.map((el, i) =>
                <TabPanel value={state.tab} index={i} key={i}>
                    <Roomview
                        id={el._id}
                        address={el.address}
                        openWeekday={el.openWeekday}
                        images={el.images}
                        title={el.title}
                        description={el.description}
                        openingTime={el.openingTime}
                        closingTime={el.closingTime}
                        createdAt={el.createdAt}
                        updatedAt={el.updatedAt}
                        fetch={fetchData}
                    />
                </TabPanel>
            )}
        </Container>
    )
}

export default RoomManagement