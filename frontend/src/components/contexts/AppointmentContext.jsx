import React, { createContext, useState } from 'react';
import { useSnackbar } from 'notistack';

export const AppointmentContext = createContext();

export function AppointmentProvider(props) {
    const [selectedTimeslots, setSelectedTimeslots] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const addTimeslot = (year, month, date, hour) => {
        enqueueSnackbar(`已加入 ${year}年${month}月${date}日 ${hour}:00 - ${hour + 1}:00`, { variant: 'success', autoHideDuration: 3000 })
        setSelectedTimeslots(prevState =>
            prevState.concat({
                hour: hour,
                year: year,
                month: month,
                date: date
            })
        )
    }

    const removeTimeslot = (year, month, date, hour) => {
        enqueueSnackbar(`已取消加入 ${year}年${month}月${date}日 ${hour}:00 - ${hour + 1}:00`, { variant: 'error', autoHideDuration: 3000 })
        const index = selectedTimeslots.findIndex(el => el.hour === hour && el.year === year && el.date === date && el.month === month)
        setSelectedTimeslots(prevState =>
            prevState.filter((el, i) => i !== index)
        )
    }

    return (
        <AppointmentContext.Provider value={{ selectedTimeslots, addTimeslot, removeTimeslot }}>
            {props.children}
        </AppointmentContext.Provider>
    )
}