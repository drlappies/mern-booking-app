import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Timeslot from './Timeslot';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "row"
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

    return timeslots;
}

function generateOperatingTimeArr(openingTime, closingTime) {
    const operatingTime = [];
    for (let i = openingTime; i <= closingTime; i++) {
        operatingTime.push(i)
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

function Calendar(props) {
    const classes = useStyles();
    const { roomId, serviceId } = useParams();
    const [currentWeek, setCurrentWeek] = useState(0);
    const [currentWeekdates, setCurrentWeekdates] = useState([[0, 0], [0, 6]]);
    const [timeRange, setTimeRange] = useState(4);
    const timeslots = useMemo(() => generateTimeslotArr(props.openingTime, props.closingTime, timeRange), [props.openingTime, props.closingTime, timeRange])
    const operatingTime = useMemo(() => generateOperatingTimeArr(props.openingTime, props.closingTime), [props.openingTime, props.closingTime]);
    const weekdates = useMemo(() => generateWeekdatesArr(timeRange), [timeRange]);
    const availability = useMemo(() => checkIsDayOpen(props.availableWeekday), [props.availableWeekday])
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
        timeslotsRef.current[currentWeek][0].current.scrollIntoView({ behavior: "smooth", inline: "start" })
    }, [currentWeek])

    return (
        <Container>
            <Grid container direction="row" spacing={1}>
                <Grid item xs={12}>
                    <Typography variant="h4">{props.roomName}</Typography>
                    <Typography display="inline" variant="h5">{props.serviceName}</Typography>
                    <Typography display="inline"> - </Typography>
                    <Typography display="inline" variant="subtitle1">{props.serviceRemark}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="subtitle1">營業日子：逢星期{availability.map(el => <span key={uuidv4()}>&nbsp;{weekday[el]}&nbsp;</span>)}</Typography>
                    <Typography variant="subtitle1">營業時間：{props.openingTime}:00 - {props.closingTime}:00</Typography>
                    <Typography variant="subtitle1">收費：{props.servicePrice} / 小時</Typography>
                </Grid>
                <Grid item xs={11}>
                    <Button disabled={!currentWeek} onClick={prevWeek}>上星期</Button>
                    <Button onClick={thisWeek}>重設</Button>
                    <Button disabled={currentWeek === timeslots.length - 1} onClick={nextWeek}>下星期</Button>
                </Grid>
                <Grid item xs={1}>
                    <Button component={Link} to={`/room/${roomId}/service/${serviceId}/appointment/confirmation`} fullWidth endIcon={<NavigateNextIcon />}>確定</Button>
                </Grid>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                    <div className={classes.root}>
                        <div>
                            <Typography>&nbsp;</Typography>
                            <Typography>&nbsp;</Typography>
                            {operatingTime.map(el =>
                                <div className={classes.slot} key={uuidv4()}>
                                    <Typography>{el}:00</Typography>
                                </div>
                            )}
                        </div>
                        <div className={classes.calendar}>
                            {timeslots.map((week, i) =>
                                week.map((day, j) =>
                                    <div ref={timeslotsRef.current[i][j]} key={uuidv4()}>
                                        <div>
                                            <Typography>星期{weekday[weekdates[i][j].getDay()]}</Typography>
                                            <Typography>{weekdates[i][j].getFullYear()}年{weekdates[i][j].getMonth() + 1}月{weekdates[i][j].getDate()}日</Typography>
                                        </div>
                                        {day.map(slot =>
                                            <Timeslot
                                                key={uuidv4()}
                                                hour={slot.time}
                                                year={slot.date.getFullYear()}
                                                month={slot.date.getMonth() + 1}
                                                date={slot.date.getDate()}
                                                isOpen={availability.includes(slot.date.getDay())}
                                            />
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </Grid>
            </Grid>
        </Container >
    )
}
export default Calendar