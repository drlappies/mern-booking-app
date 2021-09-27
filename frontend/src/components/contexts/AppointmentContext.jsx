import React, { createContext, useState } from 'react';
import { useSnackbar } from 'notistack';
import axios from 'axios';

export const AppointmentContext = createContext();

export function AppointmentProvider(props) {
    const { enqueueSnackbar } = useSnackbar();
    const [selectedTimeslots, setSelectedTimeslots] = useState([]);
    const [currentRoom, setCurrentRoom] = useState({
        title: "",
        description: "",
        owner: "",
        street: "",
        floor: "",
        flat: "",
        building: "",
        region: "",
        openingTime: 0,
        closingTime: 0,
        openWeekday: {
            0: true,
            1: true,
            2: true,
            3: true,
            4: true,
            5: true,
            6: true
        },
        image: [],
        service: [],
    })

    const fetchRoom = async (id) => {
        try {
            const res = await axios.get(`/api/room/${id}`)
            setCurrentRoom({
                title: res.data.title,
                description: res.data.description,
                owner: res.data.owner.title,
                street: res.data.address.street,
                floor: res.data.address.floor,
                flat: res.data.address.flat,
                building: res.data.address.building,
                region: res.data.address.region,
                openingTime: res.data.openingTime,
                closingTime: res.data.closingTime,
                openWeekday: res.data.openWeekday,
                image: res.data.images,
                service: res.data.services,
            })
        } catch (err) {
            console.log(err)
        }
    }


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
                roomId: roomId,
                serviceId: serviceId,
            }
            await axios.post('/api/appointment', payload, {
                headers: { 'x-auth-token': window.localStorage.getItem('token') }
            });
            setSelectedTimeslots([]);
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <AppointmentContext.Provider value={{ currentRoom, fetchRoom, selectedTimeslots, addTimeslot, removeTimeslot, bookTimeslot, resetTimeslot }}>
            {props.children}
        </AppointmentContext.Provider>
    )
}