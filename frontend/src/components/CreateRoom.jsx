import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { TimePicker } from "@material-ui/pickers";
import { DropzoneArea } from 'material-ui-dropzone';
import moment from 'moment';
import axios from 'axios';

const weekdayMarks = [
    { value: 0, label: '週一' },
    { value: 1, label: '週二' },
    { value: 2, label: '週三' },
    { value: 3, label: '週四' },
    { value: 4, label: '週五' },
    { value: 5, label: '週六' },
    { value: 6, label: '週日' }
]

const convertWeekdays = (startDay, endDay) => {
    const weekdays = {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
    }
    if (startDay === endDay) {
        Object.keys(weekdays).forEach((el, i) => {
            if (startDay === i) {
                weekdays[el] = true
            }
        })
        return weekdays
    }

    for (let i = startDay; i <= endDay; i++) {
        Object.keys(weekdays).forEach((el, j) => {
            if (i === j) {
                weekdays[el] = true
                return;
            }
        })
    }
    return weekdays
}

const useStyles = makeStyles({
    form: {
        padding: 50
    }
})

function CreateRoom() {
    const classes = useStyles()
    const [form, setForm] = useState({
        title: '',
        description: '',
        street: '',
        floor: '',
        flat: '',
        building: '',
        region: '',
        weekday: [0, 6],
    })
    const [openingTime, setOpeningTime] = useState(moment().clone().startOf('hour'));
    const [closingTime, setClosingTime] = useState(moment().clone().startOf('hour'));

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        })
    }

    const handleDaySlide = (e, value) => {
        setForm({
            ...form,
            weekday: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const [startDay, endDay] = form.weekday
        const weekdays = convertWeekdays(startDay, endDay)
        const payload = {
            title: form.title,
            description: form.description,
            address: {
                street: form.street,
                floor: form.floor,
                flat: form.flat,
                building: form.building,
                region: form.region
            },
            availability: {
                weekday: weekdays,
                operatingTime: {
                    openingTime: openingTime._d.getHours(),
                    closingTime: closingTime._d.getHours()
                }
            }
        }
        try {
            await axios.post('/room', payload)
        } catch (err) {
            console.log(err)
        }
    }

    const handleReset = () => {
        setForm({
            title: '',
            description: '',
            street: '',
            floor: '',
            flat: '',
            building: '',
            region: '',
            weekday: [0, 6]
        })
        setOpeningTime(moment().clone().startOf('hour'));
        setClosingTime(moment().clone().startOf('hour'));
    }

    return (
        <Container maxWidth='md'>
            <Paper className={classes.form} elevation={3}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h4'>創立新的房間</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h5'>基本資訊</Typography>
                        </Grid>
                        <Grid item md={6} sm={12}>
                            <TextField
                                fullWidth
                                id="title"
                                name="title"
                                label="琴房名稱"
                                variant="outlined"
                                value={form.title}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item md={6} sm={12}>
                            <TextField
                                fullWidth
                                id="description"
                                name="description"
                                label="琴房介紹"
                                variant="outlined"
                                value={form.description}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h5'>地址</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                id="floor"
                                name="floor"
                                label="樓層"
                                variant="outlined"
                                value={form.floor}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                id="flat"
                                name="flat"
                                label="單位"
                                variant="outlined"
                                value={form.flat}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                id="building"
                                name="building"
                                label="大廈"
                                variant="outlined"
                                value={form.building}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={10}>
                            <TextField
                                fullWidth
                                id="street"
                                name="street"
                                label="街道名稱"
                                variant="outlined"
                                value={form.street}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                fullWidth
                                id="region"
                                name="region"
                                label="區域"
                                variant="outlined"
                                value={form.region}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h5'>營業時間</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>日期</Typography>
                            <Slider
                                marks={weekdayMarks}
                                steps={6}
                                min={0}
                                max={6}
                                value={form.weekday}
                                onChange={handleDaySlide}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <TimePicker
                                    label="開門時間"
                                    value={openingTime}
                                    minutesStep={60}
                                    onChange={setOpeningTime}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={3}>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <TimePicker
                                    label="開門時間"
                                    value={closingTime}
                                    minutesStep={60}
                                    onChange={setClosingTime}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5">圖片上傳</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <DropzoneArea
                                acceptedFiles={['image/*']}
                                dropzoneText={"拖放或點擊"}
                                filesLimit={5}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Button fullWidth variant="contained" onClick={handleReset}>重設</Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button fullWidth variant="contained" type="submit">提交</Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container >
    )
}


export default CreateRoom