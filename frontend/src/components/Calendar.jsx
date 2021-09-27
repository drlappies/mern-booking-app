import React, { useState, useMemo } from 'react';
import Timeslot from './Timeslot';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card'
import { CardContent } from '@material-ui/core';

const weekday = ['日', '一', '二', '三', '四', '五', '六',]

function checkIsDayOpen(openWeekday) {
    let map = {
        0: openWeekday.sunday,
        1: openWeekday.monday,
        2: openWeekday.tuesday,
        3: openWeekday.wednesday,
        4: openWeekday.thursday,
        5: openWeekday.friday,
        6: openWeekday.saturday
    }

    return map
}

function generateCalendar(openingTime, closingTime, currentWeek) {
    if (openingTime === undefined) openingTime = 9;
    if (closingTime === undefined) closingTime = 23;
    if (currentWeek === undefined) currentWeek = 0;

    const calendar = [];

    if (closingTime > openingTime) {
        for (let i = openingTime; i <= closingTime; i++) {
            const week = [];
            for (let j = 0; j < 7; j++) {
                week.push({
                    time: i,
                    date: new Date(new Date().setDate(new Date().getDate() + j + currentWeek)),
                    isNextDay: false
                })
            }
            calendar.push(week)
        }

        return calendar
    } else {
        let increment = 0;

        for (let i = 0; i < closingTime - openingTime + 25; i++) {
            const week = [];
            if (i + openingTime >= 24) {
                for (let j = 0; j < 7; j++) {
                    week.push({
                        time: increment,
                        date: new Date(new Date().setDate(new Date().getDate() + j + currentWeek + 1)),
                        isNextDay: true
                    })
                }
                increment = increment + 1
            } else {
                for (let j = 0; j < 7; j++) {
                    week.push({
                        time: i + openingTime,
                        date: new Date(new Date().setDate(new Date().getDate() + j + currentWeek)),
                        isNextDay: false
                    })
                }
            }
            calendar.push(week)

        }

        return calendar
    }
}

function checkIsTimeslotTaken(appointments, year, month, date, hour) {
    if (appointments === undefined) return false
    if (appointments.some(el => el.year === year && el.month === month && el.date === date && el.hour === hour)) return true
    return false;
}

function getAppointmentID(appointments, year, month, date, hour) {
    const appointment = appointments.find(el => el.year === year && el.month === month && el.date === date && el.hour === hour)
    if (appointment) {
        return appointment._id
    } else {
        return ""
    }
}

function Calendar(props) {
    const [state, setState] = useState({
        currentWeek: 0,
        currentWeekFrom: new Date(),
        currentWeekTo: new Date(new Date().setDate(new Date().getDate() + 6))
    })

    const calendar = useMemo(() => generateCalendar(props.openingTime, props.closingTime, state.currentWeek), [props.openingTime, props.closingTime, state.currentWeek])
    const availabilityWeekday = useMemo(() => checkIsDayOpen(props.openWeekday), [props.openWeekday])

    const prevWeek = () => {
        setState(prevState => {
            return {
                ...prevState,
                currentWeek: prevState.currentWeek - 7,
                currentWeekFrom: new Date(prevState.currentWeekFrom.setDate(prevState.currentWeekFrom.getDate() - 7)),
                currentWeekTo: new Date(prevState.currentWeekTo.setDate(prevState.currentWeekTo.getDate() - 7))
            }
        })
    }

    const nextWeek = () => {
        setState(prevState => {
            return {
                ...prevState,
                currentWeek: prevState.currentWeek + 7,
                currentWeekFrom: new Date(prevState.currentWeekFrom.setDate(prevState.currentWeekFrom.getDate() + 7)),
                currentWeekTo: new Date(prevState.currentWeekTo.setDate(prevState.currentWeekTo.getDate() + 7))
            }
        })
    }

    const thisWeek = () => {
        setState(prevState => {
            return {
                ...prevState,
                currentWeek: 0,
                currentWeekFrom: new Date(),
                currentWeekTo: new Date(new Date().setDate(new Date().getDate() + 6))
            }
        })
    }

    return (
        <Card raised>
            <CardContent>
                <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Grid item>
                        <Grid container spacing={1}>
                            <Grid item>
                                <Button color="primary" variant="contained" size="small" onClick={prevWeek}>上星期</Button>
                            </Grid>
                            <Grid item>
                                <Button color="primary" variant="contained" size="small" onClick={nextWeek}>下星期</Button>
                            </Grid>
                            <Grid item>
                                <Button color="secondary" variant="contained" size="small" onClick={thisWeek}>重設</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography color="textPrimary" variant="subtitle1">{state.currentWeekFrom.getFullYear()}年{state.currentWeekFrom.getMonth() + 1}月{state.currentWeekFrom.getDate()}日 - {state.currentWeekTo.getFullYear()}年{state.currentWeekTo.getMonth() + 1}月{state.currentWeekTo.getDate()}日</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th></th>
                                    {calendar[0].map((el, i) =>
                                        <td style={{ border: "1px solid lightgrey" }} key={i}>
                                            <Typography variant="subtitle1">{el.date.getFullYear()}年{el.date.getMonth() + 1}月{el.date.getDate()}日</Typography>
                                            <Typography variant="subtitle2">星期{weekday[el.date.getDay()]}</Typography>
                                        </td>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {calendar.map((time, i, arr) =>
                                    <tr key={i}>
                                        <td style={{ border: "1px solid lightgrey", width: "100px", textAlign: "center" }}><Typography variant="subtitle2">{arr[i][0].isNextDay ? "翌日" : null} {arr[i][0].time.toString().padStart(2, "0")}:00 </Typography></td>
                                        {time.map((slot, j) =>
                                            <td key={j} style={{ border: "1px solid lightgrey" }}>
                                                <Timeslot
                                                    key={j}
                                                    id={getAppointmentID(props.appointments, slot.date.getFullYear(), slot.date.getMonth() + 1, slot.date.getDate(), slot.time)}
                                                    hour={slot.time}
                                                    year={slot.date.getFullYear()}
                                                    month={slot.date.getMonth() + 1}
                                                    date={slot.date.getDate()}
                                                    day={slot.date.getDay()}
                                                    isOpen={availabilityWeekday[slot.date.getDay()]}
                                                    isTaken={checkIsTimeslotTaken(props.appointments, slot.date.getFullYear(), slot.date.getMonth() + 1, slot.date.getDate(), slot.time)}
                                                    isViewOnly={props.isViewOnly}
                                                />
                                            </td>
                                        )}
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
export default Calendar