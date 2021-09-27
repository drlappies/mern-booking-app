import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { CardContent, makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button'
import { useSnackbar } from 'notistack';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(() => ({
    input: {
        display: "none"
    },
    panel: {
        padding: "50px"
    },
    service: {
        border: '1px solid grey',
        borderRadius: "5px",
        margin: "20px 0px 20px 0px",
        padding: "10px"
    },
    edit: {
        position: "sticky",
        left: "750px",
        bottom: "40px"
    },
    save: {
        position: "sticky",
        left: "670px",
        bottom: "40px",
    },
    backdrop: {
        zIndex: 999,
        color: '#fff',
    },
    media: {
        height: 0,
        paddingTop: '56.25%',
        margin: "5px"
    }
}));

function Roomview(props) {
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles()
    const [state, setState] = useState({
        id: props.id,
        title: props.title,
        description: props.description,
        addressStreet: props.address.street,
        addressBuilding: props.address.building,
        addressRegion: props.address.region,
        addressFlat: props.address.flat,
        addressFloor: props.address.floor,
        openingTime: props.openingTime,
        closingTime: props.closingTime,
        isMonOpen: props.openWeekday.monday,
        isTuesOpen: props.openWeekday.tuesday,
        isWedOpen: props.openWeekday.wednesday,
        isThursOpen: props.openWeekday.thursday,
        isFriOpen: props.openWeekday.friday,
        isSatOpen: props.openWeekday.saturday,
        isSunOpen: props.openWeekday.sunday,
        images: props.images,
        previews: [null, null, null, null, null],
        deleteImages: ["", "", "", "", ""],
        deleteKeys: [],
        isEditing: false,
        isSaving: false,
    })

    const toggleEditing = () => {
        setState(prevState => { return { ...prevState, isEditing: !prevState.isEditing } })
    }

    const handleChange = (event) => {
        let { name, value, checked, type } = event.target;
        if (type === 'checkbox') value = checked;
        if (name === "openingTime" || name === "closingTime") {
            value = `${value.slice(0, -3)}:00`
        }
        setState(prevState => { return { ...prevState, [name]: value } })
    }

    const handleImageChange = (event, index, key, uuid) => {
        const { files } = event.target;
        setState(prevState => {
            return {
                ...prevState,
                previews: prevState.previews.map((el, i) => i === index ? files[0] : el),
                deleteKeys: prevState.deleteKeys.concat(key),
                deleteImages: prevState.deleteImages.map((el, i) => i === index ? uuid : el)
            }
        })
    }

    const removePreview = (index, key) => {
        setState(prevState => {
            return {
                ...prevState,
                previews: prevState.previews.map((el, i) => i === index ? null : el),
                deleteImages: prevState.deleteImages.map((el, i) => i === index ? "" : el),
                deleteKeys: prevState.deleteKeys.filter(el => el !== key),
            }
        })
    }

    const handleSave = async () => {
        try {
            setState(prevState => { return { ...prevState, isSaving: !prevState.isSaving } })

            if (!state.title || !state.description || !state.addressStreet || !state.addressBuilding || !state.addressRegion || !state.addressFloor || !state.openingTime || !state.closingTime) {
                enqueueSnackbar("資料不足", { variant: 'success', autoHideDuration: 1500 })
                return setState(prevState => { return { ...prevState, isSaving: !prevState.isSaving } })
            }

            if ([state.isMonOpen, state.isTuesOpen, state.isWedOpen, state.isThursOpen, state.isFriOpen, state.isSatOpen, state.isSunOpen].every(e => e === false)) {
                enqueueSnackbar("請至少選擇一個開放日期！", { variant: 'error', autoHideDuration: 3000 })
                return setState(prevState => { return { ...prevState, isSaving: !prevState.isSaving } })
            }

            let formdata = new FormData()
            formdata.append('title', state.title)
            formdata.append('description', state.description)
            formdata.append('addressStreet', state.addressStreet)
            formdata.append('addressBuilding', state.addressBuilding)
            formdata.append('addressRegion', state.addressRegion)
            formdata.append('addressFlat', state.addressFlat)
            formdata.append('addressFloor', state.addressFloor)
            formdata.append("openingTime", parseInt(state.openingTime.slice(0, -3)))
            formdata.append("closingTime", parseInt(state.closingTime.slice(0, -3)))
            formdata.append('isMonOpen', state.isMonOpen)
            formdata.append('isTuesOpen', state.isTuesOpen)
            formdata.append('isWedOpen', state.isWedOpen)
            formdata.append('isThursOpen', state.isThursOpen)
            formdata.append('isFriOpen', state.isFriOpen)
            formdata.append('isSatOpen', state.isSatOpen)
            formdata.append('isSunOpen', state.isSunOpen)

            state.previews.forEach(el => {
                if (el) formdata.append('image', el)
            })

            state.deleteKeys.forEach(el => {
                formdata.append('deletedKeys', el)
            })

            state.deleteImages.forEach(el => {
                if (el) formdata.append('deletedImages', el)
            })

            const res = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/api/room/${props.id}`, formdata, {
                headers: { 'x-auth-token': window.localStorage.getItem('token') }
            })
            props.fetch()
            enqueueSnackbar(res.data.success, { variant: 'success', autoHideDuration: 1500 })
            setState(prevState => { return { ...prevState, isSaving: !prevState.isSaving, isEditing: !prevState.isEditing } })
        } catch (err) {
            enqueueSnackbar(err.response.data.error, { variant: 'error', autoHideDuration: 1500 })
            setState(prevState => { return { ...prevState, isSaving: !prevState.isSaving, isEditing: !prevState.isEditing } })
        }
    }

    const handleDelete = async () => {
        try {
            setState(prevState => { return { ...prevState, isSaving: !prevState.isSaving } })
            const res = await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/api/room/${props.id}`, {
                headers: { 'x-auth-token': window.localStorage.getItem('token') }
            })
            props.fetch()
            enqueueSnackbar(res.data.success, { variant: 'success', autoHideDuration: 1500 })
            setState(prevState => { return { ...prevState, isSaving: !prevState.isSaving, isEditing: !prevState.isEditing } })
        } catch (err) {
            enqueueSnackbar(err.response.data.error, { variant: 'error', autoHideDuration: 1500 })
            setState(prevState => { return { ...prevState, isSaving: !prevState.isSaving, isEditing: !prevState.isEditing } })
        }
    }

    useEffect(() => {
        setState(prevState => {
            return {
                ...prevState,
                id: props.id,
                title: props.title,
                description: props.description,
                addressStreet: props.address.street,
                addressBuilding: props.address.building,
                addressRegion: props.address.region,
                addressFlat: props.address.flat,
                addressFloor: props.address.floor,
                openingTime: `${props.openingTime.toString().padStart(2, '0')}:00`,
                closingTime: `${props.closingTime.toString().padStart(2, '0')}:00`,
                isMonOpen: props.openWeekday.monday,
                isTuesOpen: props.openWeekday.tuesday,
                isWedOpen: props.openWeekday.wednesday,
                isThursOpen: props.openWeekday.thursday,
                isFriOpen: props.openWeekday.friday,
                isSatOpen: props.openWeekday.saturday,
                isSunOpen: props.openWeekday.sunday,
                images: props.images,
                previews: [null, null, null, null, null],
                deleteImages: ["", "", "", "", ""],
                deleteKeys: [],
            }
        })
    }, [state.isEditing, props.address.building, props.address.flat, props.address.floor, props.address.region, props.address.street, props.closingTime, props.description, props.id, props.openWeekday.friday, props.openWeekday.monday, props.openWeekday.saturday, props.openWeekday.sunday, props.openWeekday.thursday, props.openWeekday.tuesday, props.openWeekday.wednesday, props.openingTime, props.services, props.title, props.imageUrl, props.imageKey, props.images])

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Grid container spacing={1}>
                    <Grid item>
                        <Button variant="contained" onClick={() => toggleEditing()} color={state.isEditing ? "default" : "primary"}>{state.isEditing ? "取消" : "修改"}</Button>
                    </Grid>
                    <Grid item>
                        {state.isEditing ? <Button variant="contained" color="primary" onClick={() => handleSave()}>確定並提交</Button> : null}
                    </Grid>
                    <Grid item>
                        {state.isEditing ? <Button variant="contained" color="secondary" onClick={() => handleDelete()}>刪除房間</Button> : null}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card raised>
                    <CardContent>
                        <Typography variant="h6">房間資訊</Typography>
                        <TextField fullWidth margin="normal" size="small" label="ID" value={state.id} disabled />
                        <TextField fullWidth margin="normal" size="small" label="房間名稱" name="title" value={state.title} disabled={!state.isEditing} onChange={(e) => handleChange(e)} />
                        <TextField fullWidth margin="normal" multiline size="small" rows={8} label="房間介紹" name="description" value={state.description} disabled={!state.isEditing} onChange={(e) => handleChange(e)} />
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card raised>
                    <CardContent>
                        <Typography variant="h6">房間地址</Typography>
                        <TextField fullWidth margin="normal" label="室" size="small" value={state.addressFlat} name="addressFlat" disabled={!state.isEditing} onChange={(e) => handleChange(e)} />
                        <TextField fullWidth margin="normal" label="樓層" size="small" value={state.addressFloor} name="addressFloor" disabled={!state.isEditing} onChange={(e) => handleChange(e)} />
                        <TextField fullWidth margin="normal" label="大廈" size="small" value={state.addressBuilding} name="addressBuilding" disabled={!state.isEditing} onChange={(e) => handleChange(e)} />
                        <TextField fullWidth margin="normal" label="街道" size="small" value={state.addressStreet} name="addressStreet" disabled={!state.isEditing} onChange={(e) => handleChange(e)} />
                        <TextField fullWidth margin="normal" label="區域" size="small" value={state.addressRegion} name="addressRegion" disabled={!state.isEditing} onChange={(e) => handleChange(e)} />
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card raised>
                    <CardContent>
                        <Typography variant="h6">開放時間</Typography>
                        <TextField fullWidth margin="normal" label="開門時間" size="small" type="time" name="openingTime" value={`${state.openingTime.toString().padStart(2, 0)}:00`} disabled={!state.isEditing} onChange={(e) => handleChange(e)} />
                        <TextField fullWidth margin="normal" label="關門時間" size="small" type="time" name="closingTime" value={`${state.closingTime.toString().padStart(2, 0)}:00`} disabled={!state.isEditing} onChange={(e) => handleChange(e)} />
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card raised>
                    <CardContent>
                        <Typography variant="h6">開放日期</Typography>
                        <FormControl>
                            <FormGroup row>
                                <FormControlLabel
                                    control={<Checkbox color="primary" checked={state.isMonOpen} name="isMonOpen" disabled={!state.isEditing} onChange={(e) => handleChange(e)} />}
                                    label="星期一"
                                    labelPlacement="start"
                                />
                                <FormControlLabel
                                    control={<Checkbox color="primary" checked={state.isTuesOpen} name="isTuesOpen" disabled={!state.isEditing} onChange={(e) => handleChange(e)} />}
                                    label="星期二"
                                    labelPlacement="start"

                                />
                                <FormControlLabel
                                    control={<Checkbox color="primary" checked={state.isWedOpen} name="isWedOpen" disabled={!state.isEditing} onChange={(e) => handleChange(e)} />}
                                    label="星期三"
                                    labelPlacement="start"

                                />
                                <FormControlLabel
                                    control={<Checkbox color="primary" checked={state.isThursOpen} name="isThursOpen" disabled={!state.isEditing} onChange={(e) => handleChange(e)} />}
                                    label="星期四"
                                    labelPlacement="start"
                                />
                                <FormControlLabel
                                    control={<Checkbox color="primary" checked={state.isFriOpen} name="isFriOpen" disabled={!state.isEditing} onChange={(e) => handleChange(e)} />}
                                    label="星期五"
                                    labelPlacement="start"
                                />
                                <FormControlLabel
                                    control={<Checkbox color="primary" checked={state.isSatOpen} name="isSatOpen" disabled={!state.isEditing} onChange={(e) => handleChange(e)} />}
                                    label="星期六"
                                    labelPlacement="start"

                                />
                                <FormControlLabel
                                    control={<Checkbox color="primary" checked={state.isSunOpen} name="isSunOpen" disabled={!state.isEditing} onChange={(e) => handleChange(e)} />}
                                    label="星期日"
                                    labelPlacement="start"
                                />
                            </FormGroup>
                        </FormControl>
                    </CardContent>
                </Card>
            </Grid>
            {state.images.map((el, i) =>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <CardMedia image={el.url} alt={el.url} className={classes.media} />
                            {state.previews[i] && state.isEditing ? <CardMedia image={URL.createObjectURL(state.previews[i])} alt={i} className={classes.media} /> : null}
                        </CardContent>
                        <CardActions>
                            <input
                                accept="image/*"
                                className={classes.input}
                                id={i}
                                type="file"
                                onChange={(e) => handleImageChange(e, i, el.key, el._id)} 
                            />
                            {state.previews[i] ? <Button variant="contained" color="secondary" style={{ margin: 10 }} onClick={() => removePreview(i, el.key)}>刪除</Button>
                                :
                                <label htmlFor={i}>
                                    {state.isEditing ? <Button component="span" variant="contained" color="primary" style={{ margin: 10 }}>重新上傳</Button> : null}
                                </label>
                            }
                        </CardActions>
                    </Card>
                </Grid>
            )}
            <Backdrop className={classes.backdrop} open={state.isSaving}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Grid>

    )
}

export default Roomview