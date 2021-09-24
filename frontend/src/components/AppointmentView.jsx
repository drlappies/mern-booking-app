import React, { useEffect, useCallback, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Calendar from './Calendar'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import axios from 'axios'
import { useSnackbar } from 'notistack';

function AppointmentView(props) {
    const { enqueueSnackbar } = useSnackbar();
    const { roomId, openingTime, closingTime, openWeekday, services } = props
    const [state, setState] = useState({
        serviceId: "",
        appointments: []
    })

    const fetchData = useCallback(async () => {
        try {
            if (!state.serviceId) return;
            const res = await axios.get(`/api/appointment/${roomId}/room/${state.serviceId}/service`)
            setState(prevState => { return { ...prevState, appointments: res.data } })
        } catch (err) {
            enqueueSnackbar(err.response.data.error, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
        }

    }, [enqueueSnackbar, roomId, state.serviceId])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleSelect = async (event) => {
        const { name, value } = event.target
        setState(prevState => { return { ...prevState, [name]: value } })
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Card raised>
                    <CardContent>
                        <TextField margin="normal" fullWidth label="服務" select name="serviceId" onChange={(e) => handleSelect(e)} value={state.serviceId}>
                            {services.map((el, j) =>
                                <MenuItem key={j} value={el._id} >
                                    {el.name}
                                </MenuItem>
                            )}
                        </TextField>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Calendar
                    openingTime={openingTime}
                    closingTime={closingTime}
                    openWeekday={openWeekday}
                    appointments={state.appointments}
                    isViewOnly={true}
                />
            </Grid>
        </Grid>
    )
}

export default AppointmentView