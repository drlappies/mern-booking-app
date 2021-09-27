import React, { useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import axios from 'axios'
import { useSnackbar } from 'notistack';

function Roominfo(props) {
    const { enqueueSnackbar } = useSnackbar();
    const [state, setState] = useState({
        title: '...',
        description: '...',
        titleEdit: false,
        descriptionEdit: false
    });

    const handleEdit = (action) => {
        setState(prevState => ({
            title: prevState.title,
            description: prevState.description,
            titleEdit: (action === 'TITLE' ? true : false),
            descriptionEdit: (action === 'DESC' ? true : false)
        }))
    }

    const handleSave = async () => {
        try {
            const payload = {
                title: state.title,
                description: state.description
            }
            await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/room/${props.id}`, payload, {
                headers: { 'x-auth-token': window.localStorage.getItem('token') }
            })

            enqueueSnackbar('更新成功', { variant: 'success', autoHideDuration: 1500 })
        } catch (err) {
            enqueueSnackbar(`失敗：${err}`, { variant: 'success', autoHideDuration: 1500 })
            console.log(err)
        }
    }

    const handleDiscard = () => {

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
            <List dense={true}>
                <ListItem>
                    {!state.titleEdit ?
                        <>
                            <ListItemText primary={'房間名稱'} secondary={props.title} />
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => handleEdit('TITLE')} >
                                    <EditIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </>
                        :
                        <>
                            <ListItemText primary={'房間名稱'} secondary={
                                <TextField
                                    size="small"
                                    margin="none"
                                    name="title"
                                    type="text"

                                    onChange={(e) => handleChange(e)}
                                />
                            } />
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => handleSave()} >
                                    <SaveIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDiscard()} >
                                    <ClearIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </>
                    }
                </ListItem>
                <ListItem>
                    {!state.descriptionEdit ?
                        <>
                            <ListItemText primary={'房間簡介'} secondary={state.description} />
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => handleEdit('DESC')} >
                                    <EditIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </>
                        :
                        <>
                            <ListItemText
                                primary={'房間簡介'}
                                secondary={
                                    <div>
                                        <TextField
                                            fullWidth
                                            multiline
                                            size="small"
                                            margin="none"
                                            name="description"
                                            type="text"
                                            value={state.description}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <div>
                                            <IconButton>
                                                <SaveIcon onClick={() => handleSave()} />
                                            </IconButton>
                                            <IconButton onClick={() => handleDiscard()}>
                                                <ClearIcon />
                                            </IconButton>
                                        </div>
                                    </div>
                                }
                            />
                        </>
                    }
                </ListItem>
            </List>
        </div>
    )
}

export default Roominfo