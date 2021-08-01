import React, { createContext, useState } from 'react';
import { useSnackbar } from 'notistack';
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

    const resetTimeslot = () => {
        setSelectedTimeslots([]);
    }

    const bookTimeslot = async (roomId, serviceId) => {
        try {
            const payload = {
                appointments: selectedTimeslots,
            }
            await axios.post(`/room/${roomId}/service/${serviceId}/appointment`, payload, {
                headers: {
                    'x-auth-token': window.localStorage.getItem('token')
                }
            });
            setSelectedTimeslots([]);
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <AppointmentContext.Provider value={{ selectedTimeslots, addTimeslot, removeTimeslot, bookTimeslot, resetTimeslot }}>
            {props.children}
        </AppointmentContext.Provider>
    )
}