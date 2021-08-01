import React, { useState, useEffect, useContext } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext';
import { useHistory } from 'react-router';
import { useSnackbar } from 'notistack';
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
        padding: '25px',
        width: '600px'
    },
    title: {
        margin: '15px 0px 15px 0px'
    },
    button: {
        margin: "15px 0 15px 0"
    }
})

function CreateRoom() {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const { checkPermission, isOwner } = useContext(AuthenticationContext);
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
    const [image, setImage] = useState();

    useEffect(() => {
        checkPermission('Owner')
    }, [checkPermission, isOwner])

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

    const handleReset = () => {
        setForm({
            title: '',
            description: '',
            street: '',
            floor: '',
            flat: '',
            building: '',
            region: '',
            weekday: [0, 6],
        })
        setOpeningTime(moment().clone().startOf('hour'));
        setClosingTime(moment().clone().startOf('hour'));
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const [startDay, endDay] = form.weekday
            const weekdays = convertWeekdays(startDay, endDay)
            const payload = {
                ...weekdays,
                title: form.title,
                description: form.description,
                street: form.street,
                floor: form.floor,
                flat: form.flat,
                building: form.building,
                region: form.region,
                openingTime: openingTime._d.getHours().toString(),
                closingTime: closingTime._d.getHours().toString(),
            }
            let formData = new FormData();
            for (let key in payload) {
                formData.append(`${key}`, payload[key])
            }
            for (let key in image) {
                formData.append('image', image[key])
            }
            const res = await axios.post('/room', formData, {
                headers:
                {
                    'content-type': 'multipart/form-data',
                    'x-auth-token': window.localStorage.getItem('token')
                }
            })
            history.push(`/room/${res.data._id}/management`);
            enqueueSnackbar(`已成功建立房間 ${res.data.title}`, { variant: 'success', autoHideDuration: 3000 })
        } catch (err) {
            enqueueSnackbar(`${err}`, { variant: 'error', autoHideDuration: 3000 })
            console.log(err)
        }
    }

    return (
        <Container>
            <Grid container justifyContent="center">
                <Paper className={classes.form} elevation={4}>
                    <form onSubmit={handleSubmit}>
                        <Grid container direction="row" spacing={2} alignContent="space-around">
                            <Grid item xs={12}>
                                <Typography variant='h6'>創立新的房間</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='body1'>基本資訊</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    className={classes.input}
                                    id="title"
                                    name="title"
                                    label="琴房名稱"
                                    variant="outlined"
                                    value={form.title}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    fullWidth
                                    id="description"
                                    name="description"
                                    label="琴房介紹"
                                    variant="outlined"
                                    value={form.description}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='body1'>地址</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    fullWidth
                                    id="floor"
                                    name="floor"
                                    label="樓層"
                                    variant="outlined"
                                    value={form.floor}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    fullWidth
                                    id="flat"
                                    name="flat"
                                    label="單位"
                                    variant="outlined"
                                    value={form.flat}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    id="building"
                                    name="building"
                                    label="大廈"
                                    variant="outlined"
                                    value={form.building}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth
                                    id="street"
                                    name="street"
                                    label="街道"
                                    variant="outlined"
                                    value={form.street}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    id="region"
                                    name="region"
                                    label="區域"
                                    variant="outlined"
                                    value={form.region}
                                    onChange={handleChange}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='body1'>營業時間</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Slider
                                    marks={weekdayMarks}
                                    steps={6}
                                    min={0}
                                    max={6}
                                    value={form.weekday}
                                    onChange={handleDaySlide}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1">日期</Typography>
                            </Grid>
                            <Grid item>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <TimePicker
                                        label="開門時間"
                                        value={openingTime}
                                        minutesStep={60}
                                        onChange={setOpeningTime}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item>
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
                                <Typography variant="body1">圖片上傳</Typography>
                                <DropzoneArea
                                    acceptedFiles={['image/*']}
                                    dropzoneText={"拖放或點擊"}
                                    filesLimit={5}
                                    maxFileSize={20000000}
                                    showPreviewsInDropzone={true}
                                    showAlerts={false}
                                    onChange={(loadedFiles) => setImage(loadedFiles)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Button className={classes.button} fullWidth variant="contained" color="primary" onClick={handleReset}>重設</Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button className={classes.button} fullWidth variant="contained" color="primary" onClick={handleSubmit}>提交</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Grid>
        </Container >
    )
}

export default CreateRoom