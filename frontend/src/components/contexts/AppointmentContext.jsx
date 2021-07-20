import React, { createContext, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export const AppointmentContext = createContext();

export function AppointmentProvider(props) {
    const [selectedTimeslots, setSelectedTimeslots] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const addTimeslot = (year, month, date, hour, day) => {
        enqueueSnackbar(`已加入時段 ${year}年${month}月${date}日 ${hour}:00 - ${hour + 1}:00`, { variant: 'success', autoHideDuration: 3000 })
        setSelectedTimeslots(prevState =>
            prevState.concat({
                hour: hour,
                year: year,
                month: month,
                date: date,
                day: day
            })
        )
    }

    const removeTimeslot = (year, month, date, hour, day) => {
        enqueueSnackbar(`已取消加入時段 ${year}年${month}月${date}日 ${hour}:00 - ${hour + 1}:00`, { variant: 'error', autoHideDuration: 3000 })
        const index = selectedTimeslots.findIndex(el => el.hour === hour && el.year === year && el.date === date && el.month === month && el.day === day)
        setSelectedTimeslots(prevState =>
            prevState.filter((el, i) => i !== index)
        )
    }

    const bookTimeslot = async (roomId, serviceId, timeslots) => {
        try {
            const payload = {
                appointments: timeslots.map(el => ({
                    service: serviceId,
                    room: roomId,
                    year: el.year,
                    month: el.month,
                    date: el.date,
                    hour: el.hour
                }))
            }
            await axios.post(`/room/${roomId}/service/${serviceId}/appointment`, payload);
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <AppointmentContext.Provider value={{ selectedTimeslots, addTimeslot, removeTimeslot, bookTimeslot }}>
            {props.children}
        </AppointmentContext.Provider>
    )
}