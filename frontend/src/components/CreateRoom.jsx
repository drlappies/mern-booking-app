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
import MenuItem from '@material-ui/core/MenuItem';
import { DropzoneArea } from 'material-ui-dropzone';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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

const convertMilitaryTime = (openingTime, closingTime, openingAMPM, closingAMPM, isNonstop) => {
    if (isNonstop) {
        return { openingTime: 0, closingTime: 23 }
    }
    if (openingAMPM === 'AM' && closingAMPM === 'AM') {
        return { openingTime: openingTime, closingTime: closingTime }
    } else if (openingAMPM === 'AM' && closingAMPM === 'PM') {
        closingTime = closingTime + 12
        return { openingTime: openingTime, closingTime: closingTime }
    } else if (openingAMPM === 'PM' && closingAMPM === 'AM') {
        openingTime = openingTime + 12
        return { openingTime: openingTime, closingTime: closingTime }
    } else {
        openingTime = openingTime + 12
        closingTime = closingTime + 12
        return { openingTime: openingTime, closingTime: closingTime }
    }
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
    },
    timepick: {
        width: '150px'
    },
    time: {
        width: '60px'
    }
})

function CreateRoom() {
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const { checkPermission, isOwner } = useContext(AuthenticationContext);
    const classes = useStyles()
    const [state, setState] = useState({
        title: '',
        description: '',
        street: '',
        floor: '',
        flat: '',
        building: '',
        region: '',
        weekday: [0, 6],
        openingTime: 12,
        closingTime: 12,
        openingAMPM: 'AM',
        closingAMPM: 'AM',
        isNonstop: false
    })
    const [image, setImage] = useState();

    useEffect(() => {
        checkPermission('Owner')
    }, [checkPermission, isOwner])

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        setState(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    const handleDaySlide = (e, value) => {
        setState(prevState => {
            return {
                ...prevState,
                weekday: value
            }
        })
    }

    const handleReset = () => {
        setState({
            title: '',
            description: '',
            street: '',
            floor: '',
            flat: '',
            building: '',
            region: '',
            weekday: [0, 6],
            openingTime: 12,
            closingTime: 12,
            openingAMPM: 'AM',
            closingAMPM: 'AM',
            isNonstop: false
        })
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const [startDay, endDay] = state.weekday
            const weekdays = convertWeekdays(startDay, endDay)
            const { openingTime, closingTime } = convertMilitaryTime(state.openingTime, state.closingTime, state.openingAMPM, state.closingAMPM, state.isNonstop)
            const payload = {
                ...weekdays,
                title: state.title,
                description: state.description,
                street: state.street,
                floor: state.floor,
                flat: state.flat,
                building: state.building,
                region: state.region,
                openingTime: openingTime,
                closingTime: closingTime
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
            console.log(res)
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
                                    value={state.title}
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
                                    value={state.description}
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
                                    value={state.floor}
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
                                    value={state.flat}
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
                                    value={state.building}
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
                                    value={state.street}
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
                                    value={state.region}
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
                                    value={state.weekday}
                                    onChange={handleDaySlide}
                                    size="small"
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    disabled={state.isNonstop}
                                    className={classes.timepick}
                                    select
                                    label="開門時間"
                                    name="openingTime"
                                    value={state.openingTime}
                                    onChange={(e) => handleChange(e)}
                                >
                                    <MenuItem value={12}>12:00</MenuItem>
                                    <MenuItem value={11}>11:00</MenuItem>
                                    <MenuItem value={10}>10:00</MenuItem>
                                    <MenuItem value={9}>9:00</MenuItem>
                                    <MenuItem value={8}>8:00</MenuItem>
                                    <MenuItem value={7}>7:00</MenuItem>
                                    <MenuItem value={6}>6:00</MenuItem>
                                    <MenuItem value={5}>5:00</MenuItem>
                                    <MenuItem value={4}>4:00</MenuItem>
                                    <MenuItem value={3}>3:00</MenuItem>
                                    <MenuItem value={2}>2:00</MenuItem>
                                    <MenuItem value={1}>1:00</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item>
                                <TextField
                                    disabled={state.isNonstop}
                                    className={classes.time}
                                    select
                                    label="AM/PM"
                                    name="openingAMPM"
                                    value={state.openingAMPM}
                                    onChange={(e) => handleChange(e)}
                                >
                                    <MenuItem value={'AM'}>AM</MenuItem>
                                    <MenuItem value={'PM'}>PM</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item>
                                <TextField
                                    disabled={state.isNonstop}
                                    className={classes.timepick}
                                    select
                                    label="關門時間"
                                    name="closingTime"
                                    value={state.closingTime}
                                    onChange={(e) => handleChange(e)}
                                >
                                    <MenuItem value={12}>12:00</MenuItem>
                                    <MenuItem value={11}>11:00</MenuItem>
                                    <MenuItem value={10}>10:00</MenuItem>
                                    <MenuItem value={9}>9:00</MenuItem>
                                    <MenuItem value={8}>8:00</MenuItem>
                                    <MenuItem value={7}>7:00</MenuItem>
                                    <MenuItem value={6}>6:00</MenuItem>
                                    <MenuItem value={5}>5:00</MenuItem>
                                    <MenuItem value={4}>4:00</MenuItem>
                                    <MenuItem value={3}>3:00</MenuItem>
                                    <MenuItem value={2}>2:00</MenuItem>
                                    <MenuItem value={1}>1:00</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item>
                                <TextField
                                    disabled={state.isNonstop}
                                    className={classes.time}
                                    select
                                    label="AM/PM"
                                    name="closingAMPM"
                                    value={state.closingAMPM}
                                    onChange={(e) => handleChange(e)}
                                >
                                    <MenuItem value={'AM'}>AM</MenuItem>
                                    <MenuItem value={'PM'}>PM</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            value={state.isNonstop}
                                            onChange={(e) => handleChange(e)}
                                            name="isNonstop"
                                            color="primary"
                                        />
                                    }
                                    label="24小時"
                                />

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