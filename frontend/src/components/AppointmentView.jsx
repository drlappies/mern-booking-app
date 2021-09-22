import React, { useEffect, useCallback, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Calendar from './Calendar'
import Grid from '@material-ui/core/Grid';
import axios from 'axios'

function AppointmentView(props) {
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
            console.log(err)
        }

    }, [roomId, state.serviceId])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleSelect = async (event) => {
        const { name, value } = event.target
        setState(prevState => { return { ...prevState, [name]: value } })
    }

    return (
        <div>
            <Grid container>
                <Grid item xs={4}>
                    <TextField fullWidth margin="normal" label="服務" select name="serviceId" onChange={(e) => handleSelect(e)} value={state.serviceId}>
                        {services.map((el, j) =>
                            <MenuItem key={j} value={el._id} >
                                {el.name}
                            </MenuItem>
                        )}
                    </TextField>
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
        </div>
    )
}

export default AppointmentView