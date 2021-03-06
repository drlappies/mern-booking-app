import React, { useState, useEffect, useCallback } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { useSnackbar } from 'notistack';

function Roomweekday(props) {
    const { enqueueSnackbar } = useSnackbar();
    const [state, setState] = useState({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        isEditing: false
    })

    const fetchData = useCallback(async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/room/${props.id}`)
        setState({
            ...res.data.openWeekday,
            isEditing: false
        })
    }, [props.id])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleChange = (e) => {
        const value = e.target.checked;
        const name = e.target.name;
        setState(prevState => { return { ...prevState, [name]: value } })
    }

    const handleEdit = () => {
        setState(prevState => ({
            ...prevState,
            isEditing: true
        }))
    }

    const handleDiscard = () => {
        fetchData()
    }

    const handleSave = async () => {
        try {
            const payload = {
                openWeekday: {
                    monday: state.monday,
                    tuesday: state.tuesday,
                    wednesday: state.wednesday,
                    thursday: state.thursday,
                    friday: state.friday,
                    saturday: state.saturday,
                    sunday: state.sunday
                }
            }
            await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/room/${props.id}`, payload, {
                headers: {
                    'x-auth-token': window.localStorage.getItem('token')
                }
            })
            fetchData();
            enqueueSnackbar('????????????', { variant: 'success', autoHideDuration: 1500 })
        } catch (err) {
            enqueueSnackbar(`?????????${err}`, { variant: 'success', autoHideDuration: 1500 })
            console.log(err)
        }
    }

    return (
        <div>
            <List dense={true} subheader={<Typography>????????????</Typography>}>
                <ListItem>
                    <ListItemText>?????????</ListItemText>
                    <ListItemSecondaryAction>
                        <Switch
                            name="monday"
                            checked={state.monday}
                            onChange={(e) => handleChange(e)}
                            disabled={!state.isEditing}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                    <ListItemText>?????????</ListItemText>
                    <ListItemSecondaryAction>
                        <Switch
                            name="tuesday"
                            checked={state.tuesday}
                            onChange={(e) => handleChange(e)}
                            disabled={!state.isEditing}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                    <ListItemText>?????????</ListItemText>
                    <ListItemSecondaryAction>
                        <Switch
                            name="wednesday"
                            checked={state.wednesday}
                            onChange={(e) => handleChange(e)}
                            disabled={!state.isEditing}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                    <ListItemText>?????????</ListItemText>
                    <ListItemSecondaryAction>
                        <Switch
                            name="thursday"
                            checked={state.thursday}
                            onChange={(e) => handleChange(e)}
                            disabled={!state.isEditing}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                    <ListItemText>?????????</ListItemText>
                    <ListItemSecondaryAction>
                        <Switch
                            name="friday"
                            checked={state.friday}
                            onChange={(e) => handleChange(e)}
                            disabled={!state.isEditing}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                    <ListItemText>?????????</ListItemText>
                    <ListItemSecondaryAction>
                        <Switch
                            name="saturday"
                            checked={state.saturday}
                            onChange={(e) => handleChange(e)}
                            disabled={!state.isEditing}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                    <ListItemText>?????????</ListItemText>
                    <ListItemSecondaryAction>
                        <Switch
                            name="sunday"
                            checked={state.sunday}
                            onChange={(e) => handleChange(e)}
                            disabled={!state.isEditing}
                        />
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                    <ListItemSecondaryAction>
                        {!state.isEditing ?
                            <Button onClick={() => handleEdit()}>??????</Button>
                            :
                            <>
                                <Button onClick={() => handleSave()}>??????</Button>
                                <Button onClick={() => handleDiscard()}>??????</Button>
                            </>
                        }
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
        </div>
    )
}


export default Roomweekday