import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(() => ({
    backdrop: {
        zIndex: 999,
        color: '#fff',
    },
}));

function ServiceView(props) {
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar();
    const [state, setState] = useState({
        services: [],
        isEditing: [false, false, false],
        isAdding: false,
        isSaving: false,
        isLoading: false,
        name: "",
        remark: "",
        pricing: "",
        capacity: "",
        isOnline: false
    })

    const toggleEditing = (index) => {
        setState(prevState => {
            return {
                ...prevState,
                isEditing: prevState.isEditing.map((el, i) => i === index ? !el : el)
            }
        })
    }

    const toggleAdding = () => {
        setState(prevState => {
            return {
                ...prevState,
                isAdding: !prevState.isAdding,
                name: "",
                remark: "",
                pricing: "",
                capacity: "",
                isOnline: false
            }
        })
    }

    const handleChange = (event, index) => {
        let { name, value } = event.target
        if (name === 'isOnline') {
            if (value === 'online') {
                value = true
            } else {
                value = false
            }
        }
        setState(prevState => {
            return {
                ...prevState,
                services: prevState.services.map((el, i) => i === index ? { ...el, [name]: value } : el)
            }
        })
    }

    const handleCreating = (event) => {
        let { name, value } = event.target
        if (name === 'isOnline') {
            if (value === 'online') {
                value = true
            } else {
                value = false
            }
        }
        setState(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    const handleSave = async (index) => {
        try {
            setState(prevState => { return { ...prevState, isLoading: !prevState.isLoading } })

            if (state.services[index].capacity <= 0 || state.services[index].capacity >= 100) {
                enqueueSnackbar('人數不能等於或少於 0 或 100', { variant: 'error', autoHideDuration: 1500 })
                return setState(prevState => { return { ...prevState, isLoading: !prevState.isLoading } })
            }

            if (state.services[index].pricing <= 0 || state.services[index].pricing >= 9999) {
                enqueueSnackbar('價錢不能等於或少於 0 或 9999', { variant: 'error', autoHideDuration: 1500 })
                return setState(prevState => { return { ...prevState, isLoading: !prevState.isLoading } })
            }

            const payload = {
                name: state.services[index].name,
                pricing: state.services[index].pricing,
                capacity: state.services[index].capacity,
                remark: state.services[index].remark,
                isOnline: state.services[index].isOnline
            }

            const res = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/api/service/${state.services[index]._id}`, payload, {
                headers: { 'x-auth-token': window.localStorage.getItem('token') }
            })
            props.fetchData()
            enqueueSnackbar(res.data.success, { variant: 'success', autoHideDuration: 1500 })
            setState(prevState => { return { ...prevState, isLoading: !prevState.isLoading, isEditing: [false, false, false] } })
        } catch (err) {
            enqueueSnackbar(err.response.data.error, { variant: 'error', autoHideDuration: 1500 })
            setState(prevState => { return { ...prevState, isLoading: !prevState.isLoading } })
        }
    }

    const handleCreate = async () => {
        try {
            const payload = {
                room: props.room,
                name: state.name,
                remark: state.remark,
                pricing: state.pricing,
                capacity: state.capacity,
                isOnline: state.isOnline
            }

            const res = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/api/service`, payload, {
                headers: { 'x-auth-token': window.localStorage.getItem('token') }
            })
            props.fetchData()
            enqueueSnackbar(res.data.success, { variant: 'success', autoHideDuration: 1500 })
            setState(prevState => { return { ...prevState, isLoading: false, isAdding: false } })
        } catch (err) {
            enqueueSnackbar(err.response.data.error, { variant: 'error', autoHideDuration: 1500 })
            setState(prevState => { return { ...prevState, isLoading: false } })
            console.log(err)
        }
    }

    const handleDelete = async (index) => {
        try {
            setState(prevState => { return { ...prevState, isLoading: false } })
            const id = state.services[index]._id
            const res = await axios.delete(`/api/service/${id}`, {
                headers: { 'x-auth-token': window.localStorage.getItem('token') }
            })
            props.fetchData()
            enqueueSnackbar(res.data.success, { variant: 'success', autoHideDuration: 1500 })
            setState(prevState => { return { ...prevState, isLoading: false } })
        } catch (err) {
            enqueueSnackbar(`錯誤: ${err}`, { variant: 'error', autoHideDuration: 1500 })
            setState(prevState => { return { ...prevState, isLoading: false } })
            console.log(err)
        }
    }

    useEffect(() => {
        setState(prevState => {
            return {
                ...prevState,
                services: props.services,
            }
        })
    }, [props.services, state.isEditing])

    return (
        <div className={classes.panel}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    {state.services.length < 3 ? <Button color={state.isAdding ? "secondary" : "primary"} variant="contained" onClick={() => toggleAdding()}>{state.isAdding ? "取消增加" : "增加服務"}</Button> : null}
                </Grid>
                {state.isAdding ?
                    <Grid item xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <TextField fullWidth required margin="normal" size="small" label="名稱" name="name" value={state.name} onChange={(e) => handleCreating(e)} />
                                <TextField fullWidth multiline rows={4} margin="normal" size="small" label="備註" name="remark" value={state.remark} onChange={(e) => handleCreating(e)} />
                                <TextField fullWidth required margin="normal" size="small" label="人數" name="capacity" type="number" value={state.capacity} onChange={(e) => handleCreating(e)} />
                                <TextField fullWidth required margin="normal" size="small" label="每小時價錢" name="pricing" type="number" value={state.pricing} onChange={(e) => handleCreating(e)} />
                                <TextField select fullWidth margin="normal" size="small" label="狀態" name="isOnline" value={state.isOnline ? "online" : "offline"} onChange={(e) => handleCreating(e)} >
                                    <MenuItem value="online">
                                        在線
                                    </MenuItem>
                                    <MenuItem value="offline">
                                        下線
                                    </MenuItem>
                                </TextField>
                            </CardContent>
                            <CardActions>
                                <Button color="primary" variant="contained" onClick={() => handleCreate()}>確定</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    : null}
                {state.services.map((el, i) =>
                    <Grid item xs={12} sm={6} md={4} key={i}>
                        <Card raised>
                            <CardContent>
                                <TextField fullWidth margin="normal" size="small" label="名稱" name="name" value={el.name} disabled={!state.isEditing[i]} onChange={(e) => handleChange(e, i)} />
                                <TextField fullWidth multiline rows={4} margin="normal" size="small" label="備註" name="remark" value={el.remark} disabled={!state.isEditing[i]} onChange={(e) => handleChange(e, i)} />
                                <TextField fullWidth margin="normal" size="small" label="人數" name="capacity" type="number" value={el.capacity} disabled={!state.isEditing[i]} onChange={(e) => handleChange(e, i)} />
                                <TextField fullWidth margin="normal" size="small" label="每小時價錢" name="pricing" type="number" value={el.pricing} disabled={!state.isEditing[i]} onChange={(e) => handleChange(e, i)} />
                                <TextField select fullWidth margin="normal" size="small" label="狀態" name="isOnline" value={el.isOnline ? "online" : "offline"} disabled={!state.isEditing[i]} onChange={(e) => handleChange(e, i)}>
                                    <MenuItem value="online">
                                        在線
                                    </MenuItem>
                                    <MenuItem value="offline">
                                        下線
                                    </MenuItem>
                                </TextField>
                            </CardContent>
                            <CardActions>
                                {state.isEditing[i] ?
                                    <React.Fragment>
                                        <Button color="default" variant="contained" onClick={() => toggleEditing(i)}>取消修改</Button>
                                        <Button color="primary" variant="contained" onClick={() => handleSave(i)}>確定修改</Button>
                                        <Button color="secondary" variant="contained" onClick={() => handleDelete(i)}>刪除服務</Button>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <Button color="primary" variant="contained" onClick={() => toggleEditing(i)}>修改</Button>
                                    </React.Fragment>
                                }
                            </CardActions>
                        </Card>
                    </Grid>
                )}
            </Grid>
            <Backdrop className={classes.backdrop} open={state.isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >
    )
}

export default ServiceView