import React, { useState, useEffect, useCallback } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import { useSnackbar } from 'notistack';

function Roomservice(props) {
    const { enqueueSnackbar } = useSnackbar();
    const [state, setState] = useState({
        services: [],
        isEditing: [],
        isAdding: false,
        newService: {
            name: '',
            pricing: '',
            capacity: '',
            remark: ''
        }
    })

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(`/api/room/${props.id}`)
            setState(prevState => ({
                isAdding: false,
                services: res.data.services,
                isEditing: Array(res.data.services.length).fill(false),
                newService: {
                    name: '',
                    pricing: '',
                    capacity: '',
                    remark: ''
                }
            }))
        } catch (err) {
            enqueueSnackbar(`錯誤：${err}`, { variant: 'error', autoHideDuration: 1500 })
            console.log(err)
        }
    }, [enqueueSnackbar, props.id])

    const handleSave = async (index, id) => {
        try {
            const payload = {
                name: state.services[index].name,
                pricing: state.services[index].pricing,
                capacity: state.services[index].capacity,
                remark: state.services[index].remark,
                isOnline: state.services[index].isOnline
            }
            await axios.put(`/service/${id}`, payload, {
                headers: {
                    'x-auth-token': window.localStorage.getItem('token')
                }
            })
            fetchData();
            enqueueSnackbar('更新成功', { variant: 'success', autoHideDuration: 1500 })
        } catch (err) {
            enqueueSnackbar(`錯誤：${err}`, { variant: 'error', autoHideDuration: 1500 })
            console.log(err)
        }
    }

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`/service/${id}`, {
                headers: {
                    'x-auth-token': window.localStorage.getItem('token')
                }
            })
            console.log(res)
            fetchData()
            enqueueSnackbar(`已經移除服務：${res.data.name}`, { variant: 'success', autoHideDuration: 1500 })
        } catch (err) {
            enqueueSnackbar(`錯誤：${err}`, { variant: 'error', autoHideDuration: 1500 })
            console.log(err)
        }
    }

    const handleEdit = (index) => {
        setState(prevState => ({
            ...prevState,
            services: prevState.services,
            isEditing: prevState.isEditing.map((el, i) => (
                i === index ? true : el
            ))
        }))
    }

    const handleDiscard = () => {
        fetchData();
    }

    const handleChange = (e, id) => {
        const name = e.target.name;
        const value = (e.target.type === 'checkbox' ? e.target.checked : e.target.value);
        setState(prevState => ({
            isEditing: prevState.isEditing,
            services: prevState.services.map(el =>
                el._id === id ? { ...el, [name]: value } : el
            )
        }))
    }

    const handleAdd = () => {
        setState(prevState => ({
            ...prevState,
            isAdding: true
        }))
    }

    const handleNewServiceChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setState(prevState => ({
            ...prevState,
            newService: {
                ...prevState.newService,
                [name]: value
            }
        }))
    }

    const handleUploadNewService = async () => {
        try {
            const payload = {
                room: props.id,
                name: state.newService.name,
                remark: state.newService.remark,
                capacity: state.newService.capacity,
                pricing: state.newService.pricing
            }
            const res = await axios.post(`/service`, payload, {
                headers: {
                    'x-auth-token': window.localStorage.getItem('token')
                }
            })
            console.log(res)
            fetchData();
            enqueueSnackbar('更新成功', { variant: 'success', autoHideDuration: 1500 })
        } catch (err) {
            enqueueSnackbar(`錯誤：${err.response.data}`, { variant: 'error', autoHideDuration: 1500 })
            console.log(err)
        }
    }

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <div>
            <List dense={true} subheader={<Typography>{'服務'}</Typography>}>
                {state.services.map((el, i) =>
                    <ListItem key={i}>
                        {!state.isEditing[i] ?
                            <>
                                <ListItemText primary={'名稱'} secondary={el.name} />
                                <ListItemText primary={'備註'} secondary={el.remark ? el.remark : '未有提供備註'} />
                                <ListItemText primary={'收費'} secondary={`${el.pricing} / 小時`} />
                                <ListItemText primary={'狀態'} secondary={el.isOnline ? '在線' : '下線'} />
                            </>
                            :
                            <>
                                <ListItemText primary={'名稱'} secondary={
                                    <TextField
                                        size="small"
                                        margin="none"
                                        name="name"
                                        type="text"
                                        value={el.name}
                                        onChange={(e) => handleChange(e, el._id)}
                                    />
                                } />
                                <ListItemText primary={'備註'} secondary={
                                    <TextField
                                        size="small"
                                        margin="none"
                                        name="remark"
                                        type="text"
                                        value={el.remark}
                                        onChange={(e) => handleChange(e, el._id)}
                                    />}
                                />
                                <ListItemText primary={'收費'} secondary={
                                    <TextField
                                        size="small"
                                        margin="none"
                                        name="pricing"
                                        type="number"
                                        value={el.pricing}
                                        onChange={(e) => handleChange(e, el._id)}
                                    />}
                                />
                                <ListItemText primary={'狀態'} secondary={
                                    <FormControlLabel
                                        label="在線"
                                        control={
                                            <Checkbox
                                                size="small"
                                                color="primary"
                                                name="isOnline"
                                                checked={el.isOnline}
                                                onChange={(e) => handleChange(e, el._id)}
                                            />}
                                    />}
                                />
                            </>
                        }
                        <ListItemSecondaryAction>
                            {!state.isEditing[i] ?
                                <IconButton size="small" onClick={() => handleEdit(i)} >
                                    <EditIcon />
                                </IconButton>
                                :
                                <>
                                    <IconButton size="small" onClick={() => handleSave(i, el._id)}>
                                        <SaveIcon />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(el._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleDiscard()}>
                                        <ClearIcon />
                                    </IconButton>
                                </>
                            }
                        </ListItemSecondaryAction>
                    </ListItem>
                )}
                <ListItem>
                    <>
                        {!state.isAdding ?
                            <ListItemText>建立服務</ListItemText>
                            :
                            <>
                                <ListItemText primary={'服務'} secondary={
                                    <TextField
                                        size="small"
                                        margin="none"
                                        name="name"
                                        type="text"
                                        onChange={(e) => handleNewServiceChange(e)}
                                    />
                                } />
                                <ListItemText primary={'備註'} secondary={
                                    <TextField
                                        size="small"
                                        margin="none"
                                        name="remark"
                                        type="text"
                                        onChange={(e) => handleNewServiceChange(e)}
                                    />
                                } />
                                <ListItemText primary={'人數'} secondary={
                                    <TextField
                                        size="small"
                                        margin="none"
                                        name="capacity"
                                        type="number"
                                        onChange={(e) => handleNewServiceChange(e)}
                                    />
                                } />
                                <ListItemText primary={'收費'} secondary={
                                    <TextField
                                        size="small"
                                        margin="none"
                                        name="pricing"
                                        type="number"
                                        onChange={(e) => handleNewServiceChange(e)}
                                    />
                                } />
                            </>
                        }
                        <ListItemSecondaryAction>
                            {!state.isAdding ?
                                <IconButton onClick={() => handleAdd()}>
                                    <AddIcon />
                                </IconButton>
                                :
                                <>
                                    <IconButton onClick={() => handleUploadNewService()} >
                                        <AddIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDiscard()}>
                                        <ClearIcon />
                                    </IconButton>
                                </>
                            }
                        </ListItemSecondaryAction>
                    </>
                </ListItem>
            </List>
        </div>
    )
}

export default Roomservice
