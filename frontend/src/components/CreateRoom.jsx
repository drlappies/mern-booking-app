import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useSnackbar } from 'notistack';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container'
import CardMedia from '@material-ui/core/CardMedia'
import axios from 'axios';

const useStyles = makeStyles({
    upload: {
        display: "none"
    },
    backdrop: {
        zIndex: 999,
        color: '#fff',
    },
    form: {
        height: "90vh",
        overflowY: "scroll"
    }
})

function CreateRoom() {
    const classes = useStyles()
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [state, setState] = useState({
        title: "",
        description: "",
        room: "",
        floor: "",
        building: "",
        street: "",
        region: "",
        openingTime: "",
        closingTime: "",
        isMonOpen: false,
        isTuesOpen: false,
        isWedOpen: false,
        isThursOpen: false,
        isFriOpen: false,
        isSatOpen: false,
        isSunOpen: false,
        is247: false,
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
        isCreating: false,
    })

    const handleChange = (e) => {
        let name = e.target.name
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        if (name === "openingTime" || name === "closingTime") {
            value = `${value.slice(0, -3)}:00`
        }
        setState(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    const addImagePreview = (e) => {
        const { name, files } = e.target
        setState(prevState => {
            return {
                ...prevState,
                [name]: files[0]
            }
        })
    }

    const removeImagePreview = (image) => {
        setState(prevState => {
            return {
                ...prevState,
                [image]: null
            }
        })
    }

    const handleSubmit = async () => {
        try {
            setState(prevState => { return { ...prevState, isCreating: true } })
            if (!state.title || !state.description || !state.floor || !state.building || !state.street || !state.region || !state.image1 || !state.image2 || !state.image3 || !state.image4 || !state.image5) {
                enqueueSnackbar("???????????????", { variant: 'error', autoHideDuration: 3000 })
                return setState(prevState => { return { ...prevState, isCreating: false } })
            }
            if ([state.isMonOpen, state.isTuesOpen, state.isWedOpen, state.isThursOpen, state.isFriOpen, state.isSatOpen, state.isSunOpen].every(e => e === false)) {
                enqueueSnackbar("????????????????????????????????????", { variant: 'error', autoHideDuration: 3000 })
                return setState(prevState => { return { ...prevState, isCreating: false } })
            }
            const formdata = new FormData()
            if (state.is247) {
                formdata.append("openingTime", "0")
                formdata.append("closingTime", "23")
            } else {
                formdata.append("openingTime", parseInt(state.openingTime.slice(0, -3)))
                formdata.append("closingTime", parseInt(state.closingTime.slice(0, -3)))
            }
            formdata.append("title", state.title)
            formdata.append("description", state.description)
            formdata.append("room", state.room)
            formdata.append("floor", state.floor)
            formdata.append("building", state.building)
            formdata.append("street", state.street)
            formdata.append("region", state.region)
            formdata.append("isMonOpen", state.isMonOpen)
            formdata.append("isTuesOpen", state.isTuesOpen)
            formdata.append("isWedOpen", state.isWedOpen)
            formdata.append("isThursOpen", state.isThursOpen)
            formdata.append("isFriOpen", state.isFriOpen)
            formdata.append("isSatOpen", state.isSatOpen)
            formdata.append("isSunOpen", state.isSunOpen)
            formdata.append("image", state.image1)
            formdata.append("image", state.image2)
            formdata.append("image", state.image3)
            formdata.append("image", state.image4)
            formdata.append("image", state.image5)

            const res = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/api/room`, formdata, {
                headers: {
                    'x-auth-token': window.localStorage.getItem('token')
                },
            })
            enqueueSnackbar(`????????????????????? ${res.data.success}`, { variant: 'success', autoHideDuration: 3000 })
            history.push('/')
            setState(prevState => { return { ...prevState, isCreating: false } })
        } catch (err) {
            enqueueSnackbar(err.response.data.error, { variant: 'error', autoHideDuration: 3000 })
            setState(prevState => { return { ...prevState, isCreating: false } })
        }
    }

    return (
        <Container>
            <Grid container justifyContent="flex-start" spacing={1}>
                <Grid item xs={6} sm={12}>
                    <Button color="primary" variant="contained" onClick={() => handleSubmit()}> ???????????????</Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card raised>
                        <CardContent>
                            <Typography variant="h6">????????????</Typography>
                            <TextField size="small" margin="normal" fullWidth label="????????????" name="title" value={state.title} onChange={(e) => handleChange(e)} />
                            <TextField size="small" margin="normal" fullWidth multiline rows={12} label="????????????" name="description" value={state.description} onChange={(e) => handleChange(e)} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">????????????</Typography>
                            <TextField size="small" margin="normal" fullWidth label="???" name="room" value={state.room} onChange={(e) => handleChange(e)} />
                            <TextField size="small" margin="normal" fullWidth label="??????" name="floor" value={state.floor} onChange={(e) => handleChange(e)} />
                            <TextField size="small" margin="normal" fullWidth label="??????" name="building" value={state.building} onChange={(e) => handleChange(e)} />
                            <TextField size="small" margin="normal" fullWidth label="??????" name="street" value={state.street} onChange={(e) => handleChange(e)} />
                            <TextField size="small" margin="normal" fullWidth label="??????" name="region" value={state.region} onChange={(e) => handleChange(e)} />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" display="inline">????????????</Typography><Typography variant="caption" display="inline">  ??????/?????????????????????</Typography>
                            <TextField size="small" margin="normal" fullWidth label="????????????" type="time" name="openingTime" value={state.openingTime} disabled={state.is247} onChange={(e) => handleChange(e)} />
                            <TextField size="small" margin="normal" fullWidth label="????????????" type="time" name="closingTime" value={state.closingTime} disabled={state.is247} onChange={(e) => handleChange(e)} />
                            <FormControl margin="normal">
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox color="primary" name="is247" checked={state.is247} onChange={(e) => handleChange(e)} />}
                                        label="?????????24????????????"
                                        labelPlacement="end"
                                    />
                                </FormGroup>
                            </FormControl>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">????????????</Typography>
                            <FormControl margin="normal">
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox color="primary" name="isMonOpen" checked={state.isMonOpen} onChange={(e) => handleChange(e)} />}
                                        label="?????????"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" name="isTuesOpen" checked={state.isTuesOpen} onChange={(e) => handleChange(e)} />}
                                        label="?????????"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" name="isWedOpen" checked={state.isWedOpen} onChange={(e) => handleChange(e)} />}
                                        label="?????????"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" name="isThursOpen" checked={state.isThursOpen} onChange={(e) => handleChange(e)} />}
                                        label="?????????"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" name="isFriOpen" checked={state.isFriOpen} onChange={(e) => handleChange(e)} />}
                                        label="?????????"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" name="isSatOpen" checked={state.isSatOpen} onChange={(e) => handleChange(e)} />}
                                        label="?????????"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" name="isSunOpen" checked={state.isSunOpen} onChange={(e) => handleChange(e)} />}
                                        label="?????????"
                                        labelPlacement="start"
                                    />
                                </FormGroup>
                            </FormControl>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        {state.image1 ? <CardMedia image={URL.createObjectURL(state.image1)} style={{ height: 0, paddingTop: '56.25%' }} /> : null}
                        <CardContent>
                            <Typography variant="h6">???????????? #1</Typography>
                        </CardContent>
                        <CardActions>
                            {
                                state.image1 ?
                                    <Button variant="contained" color="secondary" component="span" onClick={() => removeImagePreview("image1")}>????????????</Button>
                                    :
                                    <div>
                                        <label htmlFor="createRoomImage1">
                                            <Button variant="contained" color="primary" component="span">????????????</Button>
                                        </label>
                                        <input
                                            className={classes.upload}
                                            accept="image/*"
                                            id="createRoomImage1"
                                            name="image1"
                                            type="file"
                                            onChange={(e) => addImagePreview(e)}
                                        />
                                    </div>
                            }
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        {state.image2 ? <CardMedia image={URL.createObjectURL(state.image2)} style={{ height: 0, paddingTop: '56.25%' }} /> : null}
                        <CardContent>
                            <Typography variant="h6">???????????? #2</Typography>
                        </CardContent>
                        <CardActions>
                            {
                                state.image2 ?
                                    <Button variant="contained" color="secondary" onClick={() => removeImagePreview("image2")}>????????????</Button>
                                    :
                                    <div>
                                        <label htmlFor="createRoomImage2">
                                            <Button variant="contained" color="primary" component="span">????????????</Button>
                                        </label>
                                        <input
                                            className={classes.upload}
                                            accept="image/*"
                                            id="createRoomImage2"
                                            name="image2"
                                            type="file"
                                            onChange={(e) => addImagePreview(e)}
                                        />
                                    </div>
                            }
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        {state.image3 ? <CardMedia image={URL.createObjectURL(state.image3)} style={{ height: 0, paddingTop: '56.25%' }} /> : null}
                        <CardContent>
                            <Typography variant="h6">???????????? #3</Typography>
                        </CardContent>
                        <CardActions>
                            {
                                state.image3 ?
                                    <Button variant="contained" color="secondary" onClick={() => removeImagePreview("image3")}>????????????</Button>
                                    :
                                    <div>
                                        <label htmlFor="createRoomImage3">
                                            <Button variant="contained" color="primary" component="span">????????????</Button>
                                        </label>
                                        <input
                                            className={classes.upload}
                                            accept="image/*"
                                            id="createRoomImage3"
                                            name="image3"
                                            type="file"
                                            onChange={(e) => addImagePreview(e)}
                                        />
                                    </div>
                            }
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        {state.image4 ? <CardMedia image={URL.createObjectURL(state.image4)} style={{ height: 0, paddingTop: '56.25%' }} /> : null}
                        <CardContent>
                            <Typography variant="h6">???????????? #4</Typography>
                        </CardContent>
                        <CardActions>
                            {
                                state.image4 ? <Button variant="contained" color="secondary" onClick={() => removeImagePreview("image4")}>????????????</Button>
                                    :
                                    <div>
                                        <label htmlFor="createRoomImage4">
                                            <Button variant="contained" color="primary" component="span">????????????</Button>
                                        </label>
                                        <input
                                            className={classes.upload}
                                            accept="image/*"
                                            id="createRoomImage4"
                                            name="image4"
                                            type="file"
                                            onChange={(e) => addImagePreview(e)}
                                        />
                                    </div>
                            }
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card>
                        {state.image5 ? <CardMedia image={URL.createObjectURL(state.image5)} style={{ height: 0, paddingTop: '56.25%' }} /> : null}
                        <CardContent>
                            <Typography variant="h6">???????????? #5</Typography>
                        </CardContent>
                        <CardActions>
                            {state.image5 ?
                                <Button variant="contained" color="secondary" onClick={() => removeImagePreview("image5")}>????????????</Button>
                                :
                                <div>
                                    <label htmlFor="createRoomImage5">
                                        <Button variant="contained" color="primary" component="span">????????????</Button>
                                    </label>
                                    <input
                                        className={classes.upload}
                                        accept="image/*"
                                        id="createRoomImage5"
                                        name="image5"
                                        type="file"
                                        onChange={(e) => addImagePreview(e)}
                                    />
                                </div>
                            }
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
            <Backdrop className={classes.backdrop} open={state.isCreating} >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    )
}

export default CreateRoom

