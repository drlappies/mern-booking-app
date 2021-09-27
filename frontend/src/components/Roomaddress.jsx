import React, { useState, useEffect, useCallback } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import { useSnackbar } from 'notistack';
import axios from 'axios'

function Roomaddress(props) {
    const { enqueueSnackbar } = useSnackbar();
    const [state, setState] = useState({
        flat: '',
        floor: '',
        building: '',
        street: '',
        region: '',
        isEditing: false
    })


    const handleEdit = () => {
        setState(prevState => ({
            ...prevState,
            isEditing: true
        }))
    }

    const handleDiscard = () => {

    }

    const handleSave = async () => {
        try {
            const payload = {
                address: {
                    flat: state.flat,
                    floor: state.flat,
                    building: state.building,
                    street: state.street,
                    region: state.region,
                }
            }
            await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/room/${props.id}`, payload, {
                headers: {
                    'x-auth-token': window.localStorage.getItem('token')
                }
            })
    
            enqueueSnackbar('更新成功', { variant: 'success', autoHideDuration: 1500 })
        } catch (err) {
            enqueueSnackbar(`錯誤：${err}`, { variant: 'success', autoHideDuration: 1500 })
            console.log(err)
        }
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    return (
        <div>
            <List dense={true} subheader={<Typography>房間地址</Typography>}>
                <ListItem>
                    {!state.isEditing ?
                        <ListItemText
                            primary={'地址'}
                            secondary={`${state.flat}室 ${state.floor}樓 ${state.building} ${state.street} ${state.region}`}
                        />
                        :
                        <>
                            <TextField
                                size="small"
                                margin="none"
                                name="flat"
                                type="text"
                                value={state.flat}
                                onChange={(e) => handleChange(e)}
                            />
                            <TextField
                                size="small"
                                margin="none"
                                name="floor"
                                type="text"
                                value={state.floor}
                                onChange={(e) => handleChange(e)}
                            />
                            <TextField
                                size="small"
                                margin="none"
                                name="flat"
                                type="text"
                                value={state.building}
                                onChange={(e) => handleChange(e)}
                            />
                            <TextField
                                size="small"
                                margin="none"
                                name="flat"
                                type="text"
                                value={state.street}
                                onChange={(e) => handleChange(e)}
                            />
                            <TextField
                                size="small"
                                margin="none"
                                name="flat"
                                type="text"
                                value={state.region}
                                onChange={(e) => handleChange(e)}
                            />
                            <IconButton onClick={() => handleSave()}>
                                <SaveIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDiscard()}>
                                <ClearIcon />
                            </IconButton>
                        </>
                    }
                    <ListItemSecondaryAction>
                        {!state.isEditing ?
                            <IconButton onClick={() => handleEdit()}>
                                <EditIcon />
                            </IconButton>
                            :
                            null
                        }
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
        </div>
    )
}

export default Roomaddress