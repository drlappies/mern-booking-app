import React, { useEffect, useCallback, useState, useMemo } from 'react';
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios'
import Calendar from './Calendar'

const useStyles = makeStyles(() => ({
    view: {
        height: '85vh',
        overflowY: 'scroll',
    },
    select: {
        width: '200px'
    }
}))

function checkIsDayOpen(availableWeekday) {
    const availability = [];
    let increment = 0;
    for (let key in availableWeekday) {
        if (availableWeekday[key]) {
            availability.push(increment);
        }
        increment = increment + 1;
    }

    return availability;
}

function Record() {
    const classes = useStyles();
    const [state, setState] = useState({
        room: [],
        service: [],
        selectedRoom: '',
        selectedService: '',
        openingTime: 0,
        closingTime: 0,
        appointments: [],
        availableWeekday: [],
    })

    const fetchData = useCallback(async () => {
        const res = await axios.get('/user', {
            headers: {
                'x-auth-token': window.localStorage.getItem('token')
            }
        })
        setState(prevState => {
            return {
                ...prevState,
                room: res.data.room,
            }
        })
    }, [])

    const handleSubmit = async () => {
        try {
            const room = await axios.get(`/room/${state.selectedRoom}`);
            const appointments = await axios.get(`/room/${state.selectedRoom}/service/${state.selectedService}/appointment`)
            setState(prevState => {
                return {
                    ...prevState,
                    openingTime: room.data.openingTime,
                    closingTime: room.data.closingTime,
                    appointments: appointments.data,
                    availableWeekday: room.data.openWeekday
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value
        if (name === 'selectedRoom') {
            setState(prevState => {
                return {
                    ...prevState,
                    [name]: value,
                    service: prevState.room.filter(el => el._id === value).map(el => el.services).flat()
                }
            })
        } else {
            setState(prevState => {
                return {
                    ...prevState,
                    [name]: value
                }
            })
        }

    }

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const availability = useMemo(() => checkIsDayOpen(state.availableWeekday), [state.availableWeekday])

    return (
        <Container>
            <Grid container justifyContent="space-around">
                <Grid item>
                    <TextField
                        className={classes.select}
                        select
                        label="房間"
                        name="selectedRoom"
                        value={state.selectedRoom}
                        onChange={(e) => handleChange(e)}
                    >
                        {state.room.map((el, i) =>
                            <MenuItem key={i} value={el._id}>{el.title}</MenuItem>
                        )}
                    </TextField>
                </Grid>
                <Grid item>
                    <TextField
                        className={classes.select}
                        select
                        label="服務"
                        name="selectedService"
                        value={state.selectedService}
                        onChange={(e) => handleChange(e)}
                    >
                        {state.service.map((el, i) =>
                            <MenuItem key={i} value={el._id}>{el.name}</MenuItem>
                        )}
                    </TextField>
                </Grid>
                <Grid item>
                    {state.selectedService && state.selectedRoom ?
                        <Button onClick={() => handleSubmit()}>search</Button>
                        :
                        null
                    }
                </Grid>
                <Grid item xs={12}>
                    {state.appointments ?
                        <Calendar
                            openingTime={state.openingTime}
                            closingTime={state.closingTime}
                            appointments={state.appointments}
                            availableWeekday={availability}
                            view={'record'}
                        />
                        :
                        <div></div>
                    }

                </Grid>
            </Grid>
        </Container>
    )
}

export default Record