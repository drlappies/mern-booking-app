import React, { useState, useMemo, useRef, useEffect } from 'react';
import Timeslot from './Timeslot';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "row",
    },
    calendar: {
        display: "flex",
        flexDirection: "row",
        overflowX: 'hidden',
    },
    week: {
        display: "flex",
        flexDirection: "row"
    },
    slot: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid grey",
        width: "48px",
        height: "50px",
    },
    view: {
        height: '75vh',
        overflowY: 'scroll',
        overflowX: 'hidden'
    }
})

const weekday = [
    '日',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
]

function generateWeekdatesArr(timeRange) {
    const weekdates = [];
    for (let i = 0; i < timeRange; i++) {
        let week = [];
        weekdates.push(week);
    }

    let dateIncrement = 0;

    for (let i = 0; i < weekdates.length; i++) {
        for (let j = 0; j < 7; j++) {
            const currentDate = new Date()
            weekdates[i].push(new Date(currentDate.setDate(currentDate.getDate() + dateIncrement)))
            dateIncrement = dateIncrement + 1;
        }
    }
    return weekdates;
}

function generateTimeslotArr(openingTime, closingTime, timeRange) {
    const timeslots = [];
    for (let i = 0; i < timeRange; i++) {
        let weekslots = [];
        timeslots.push(weekslots)
    }

    let dateIncrement = 0;
    if (closingTime > openingTime) {
        for (let i = 0; i < timeslots.length; i++) {
            for (let j = 0; j < 7; j++) {
                let hours = [];
                for (let k = openingTime; k <= closingTime; k++) {
                    const currentDate = new Date();
                    hours.push({
                        date: new Date(currentDate.setDate(currentDate.getDate() + dateIncrement)),
                        time: k
                    })
                }
                timeslots[i].push(hours);
                dateIncrement = dateIncrement + 1
            }
        }
    } else {
        for (let i = 0; i < timeslots.length; i++) {
            for (let j = 0; j < 7; j++) {
                let hours = [];
                for (let k = openingTime; k <= 23; k++) {
                    const currentDate = new Date();
                    hours.push({
                        date: new Date(currentDate.setDate(currentDate.getDate() + dateIncrement)),
                        time: k
                    })
                }
                for (let k = 0; k < closingTime; k++) {
                    const currentDate = new Date();
                    hours.push({
                        date: new Date(currentDate.setDate(currentDate.getDate() + dateIncrement)),
                        time: k
                    })
                }
                timeslots[i].push(hours);
                dateIncrement = dateIncrement + 1;
            }
        }
    }
    return timeslots;
}

function generateOperatingTimeArr(openingTime, closingTime) {
    const operatingTime = [];
    if (closingTime > openingTime) {
        for (let i = openingTime; i <= closingTime; i++) {
            operatingTime.push(i)
        }
    } else {
        for (let i = openingTime; i <= 23; i++) {
            operatingTime.push(i);
        }
        for (let i = 0; i < closingTime; i++) {
            operatingTime.push(i)
        }
    }

    return operatingTime;
}

function generateTimeslotsRef(timeslots, timeRange) {
    const refs = [];
    for (let i = 0; i < timeRange; i++) {
        let x = [];
        refs.push(x)
    }
    let increment = 0;
    for (let i = 0; i < refs.length; i++) {
        for (let j = 0; j < 7; j++) {
            refs[i].push({ current: increment });
            increment = increment + 1;
        }
    }

    return refs;
}

function checkIsTimeslotTaken(appointments, year, month, date, hour) {
    if (appointments.some(el => el.year === year && el.month === month && el.date === date && el.hour === hour)) {
        return true
    }
    return false;
}

function Calendar(props) {
    const classes = useStyles();
    const [currentWeek, setCurrentWeek] = useState(0);
    const [currentWeekdates, setCurrentWeekdates] = useState([[0, 0], [0, 6]]);
    const [timeRange, setTimeRange] = useState(4);
    const timeslots = useMemo(() => generateTimeslotArr(props.openingTime, props.closingTime, timeRange), [props.openingTime, props.closingTime, timeRange])
    const operatingTime = useMemo(() => generateOperatingTimeArr(props.openingTime, props.closingTime), [props.openingTime, props.closingTime]);
    const weekdates = useMemo(() => generateWeekdatesArr(timeRange), [timeRange]);

    const timeslotsRef = useRef([]);
    timeslotsRef.current = useMemo(() => generateTimeslotsRef(timeslots, timeRange), [timeslots, timeRange])

    const prevWeek = () => {
        setCurrentWeek(currentWeek - 1);
        setCurrentWeekdates([[currentWeekdates[0][0] - 1, 0], [currentWeekdates[1][0] - 1, 6]])
    }

    const nextWeek = () => {
        setCurrentWeek(currentWeek + 1);
        setCurrentWeekdates([[currentWeekdates[0][0] + 1, 0], [currentWeekdates[1][0] + 1, 6]])
    }

    const thisWeek = () => {
        setCurrentWeek(currentWeek - currentWeek);
        setCurrentWeekdates([[0, 0], [0, 6]])
    }

    useEffect(() => {
        timeslotsRef.current[currentWeek][0].current.scrollIntoView({ behavior: "smooth", inline: "start" });
    }, [currentWeek])

    return (
        <Container>
            <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Grid item>
                    <Button disabled={!currentWeek} onClick={prevWeek}>上星期</Button>
                    <Button onClick={thisWeek}>重設</Button>
                </Grid>
                <Grid item>
                    <Typography>
                        <span>目前查看 - </span>
                        <span>{weekdates[currentWeekdates[0][0]][currentWeekdates[0][1]].getFullYear()}年</span>
                        <span>{weekdates[currentWeekdates[0][0]][currentWeekdates[0][1]].getMonth() + 1}月</span>
                        <span>{weekdates[currentWeekdates[0][0]][currentWeekdates[0][1]].getDate()}日</span>
                        <span>&nbsp;至&nbsp;</span>
                        <span>{weekdates[currentWeekdates[1][0]][currentWeekdates[1][1]].getFullYear()}年</span>
                        <span>{weekdates[currentWeekdates[1][0]][currentWeekdates[1][1]].getMonth() + 1}月</span>
                        <span>{weekdates[currentWeekdates[1][0]][currentWeekdates[1][1]].getDate()}日</span>
                    </Typography>
                </Grid>
                <Grid item>
                    <Button disabled={currentWeek === timeslots.length - 1} onClick={nextWeek}>下星期</Button>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.view}>
                        <div className={classes.root}>
                            <div>
                                <Typography>&nbsp;</Typography>
                                <Typography>&nbsp;</Typography>
                                {operatingTime.map((el, i) =>
                                    <div className={classes.slot} key={i}>
                                        <Typography>{el}:00</Typography>
                                    </div>
                                )}
                            </div>
                            <div className={classes.calendar}>
                                {timeslots.map((week, i) =>
                                    week.map((day, j) =>
                                        <div ref={timeslotsRef.current[i][j]} key={j} >
                                            <div>
                                                <Typography>星期{weekday[weekdates[i][j].getDay()]}</Typography>
                                                <Typography>{weekdates[i][j].getFullYear()}年{weekdates[i][j].getMonth() + 1}月{weekdates[i][j].getDate()}日</Typography>
                                            </div>
                                            {day.map((slot, k) =>
                                                <Timeslot
                                                    key={k}
                                                    hour={slot.time}
                                                    year={slot.date.getFullYear()}
                                                    month={slot.date.getMonth() + 1}
                                                    date={slot.date.getDate()}
                                                    day={slot.date.getDay()}
                                                    isOpen={props.availableWeekday.includes(slot.date.getDay())}
                                                    isTaken={checkIsTimeslotTaken(props.appointments, slot.date.getFullYear(), slot.date.getMonth() + 1, slot.date.getDate(), slot.time)}
                                                    view={props.view}
                                                />
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </Container >
    )
}
export default Calendar