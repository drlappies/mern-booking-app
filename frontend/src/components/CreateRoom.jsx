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
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid'
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
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
            const formdata = new FormData()
            if (state.is247) {
                formdata.append("openingTime", "0")
                formdata.append("closingTime", "23")
            } else {
                formdata.append("openingTime", state.openingTime.slice(0, -3))
                formdata.append("closingTime", state.closingTime.slice(0, -3))
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

            const res = await axios.post('/api/room', formdata, {
                headers: {
                    'x-auth-token': window.localStorage.getItem('token')
                },
            })
            enqueueSnackbar(`已成功建立房間 ${res.data.success}`, { variant: 'success', autoHideDuration: 3000 })
            history.push('/')
            setState(prevState => { return { ...prevState, isCreating: false } })
        } catch (err) {
            enqueueSnackbar(err.response.data.error, { variant: 'error', autoHideDuration: 3000 })
            setState(prevState => { return { ...prevState, isCreating: false } })
        }
    }

    return (
        <div>
            <Grid container direction="row" justifyContent="center">
                <Grid item xl={5} lg={5} md={6} sm={8} xs={10}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">房間資訊</Typography>
                            <TextField margin="normal" fullWidth label="房間名稱" name="title" value={state.title} onChange={(e) => handleChange(e)} />
                            <TextField margin="normal" fullWidth multiline maxRows={4} label="房間介紹" name="description" value={state.description} onChange={(e) => handleChange(e)} />
                            <Typography variant="h6">房間地址</Typography>
                            <TextField margin="normal" fullWidth label="室" name="room" value={state.room} onChange={(e) => handleChange(e)} />
                            <TextField margin="normal" fullWidth label="樓層" name="floor" value={state.floor} onChange={(e) => handleChange(e)} />
                            <TextField margin="normal" fullWidth label="大廈" name="building" value={state.building} onChange={(e) => handleChange(e)} />
                            <TextField margin="normal" fullWidth label="街道" name="street" value={state.street} onChange={(e) => handleChange(e)} />
                            <TextField margin="normal" fullWidth label="區域" name="region" value={state.region} onChange={(e) => handleChange(e)} />
                            <Typography variant="h6" display="inline">開放時間</Typography><Typography variant="caption" display="inline">  分鐘/秒數不計算在內</Typography>
                            <TextField margin="normal" fullWidth label="開門時間" type="time" name="openingTime" value={state.openingTime} disabled={state.is247} onChange={(e) => handleChange(e)} />
                            <TextField margin="normal" fullWidth label="關門時間" type="time" name="closingTime" value={state.closingTime} disabled={state.is247} onChange={(e) => handleChange(e)} />
                            <FormControl margin="normal">
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox color="primary" name="is247" checked={state.is247} onChange={(e) => handleChange(e)} />}
                                        label="房間為24小時開放"
                                        labelPlacement="end"
                                    />
                                </FormGroup>
                            </FormControl>
                            <Typography variant="h6">開放日期</Typography>
                            <FormControl margin="normal">
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox color="primary" name="isMonOpen" checked={state.isMonOpen} onChange={(e) => handleChange(e)} />}
                                        label="星期一"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" name="isTuesOpen" checked={state.isTuesOpen} onChange={(e) => handleChange(e)} />}
                                        label="星期二"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" name="isWedOpen" checked={state.isWedOpen} onChange={(e) => handleChange(e)} />}
                                        label="星期三"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" name="isThursOpen" checked={state.isThursOpen} onChange={(e) => handleChange(e)} />}
                                        label="星期四"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" name="isFriOpen" checked={state.isFriOpen} onChange={(e) => handleChange(e)} />}
                                        label="星期五"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" name="isSatOpen" checked={state.isSatOpen} onChange={(e) => handleChange(e)} />}
                                        label="星期六"
                                        labelPlacement="start"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox color="primary" name="isSunOpen" checked={state.isSunOpen} onChange={(e) => handleChange(e)} />}
                                        label="星期日"
                                        labelPlacement="start"
                                    />
                                </FormGroup>
                            </FormControl>
                            <Typography variant="h6">房間圖片</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>圖片預覽</TableCell>
                                            <TableCell align="right">修改</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{state.image1 ? <img alt={state.image1} src={URL.createObjectURL(state.image1)} height="400" width="600" /> : null}</TableCell>
                                            <TableCell align="right">
                                                {
                                                    state.image1 ?
                                                        <Button variant="contained" color="secondary" component="span" onClick={() => removeImagePreview("image1")}>移除圖片</Button>
                                                        :
                                                        <div>
                                                            <label htmlFor="createRoomImage1">
                                                                <Button variant="contained" color="primary" component="span">上傳圖片</Button>
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
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>{state.image2 ? <img alt={state.image2} src={URL.createObjectURL(state.image2)} height="400" width="600" /> : null}</TableCell>
                                            <TableCell align="right">
                                                {
                                                    state.image2 ?
                                                        <Button variant="contained" color="secondary" onClick={() => removeImagePreview("image2")}>移除圖片</Button>
                                                        :
                                                        <div>
                                                            <label htmlFor="createRoomImage2">
                                                                <Button variant="contained" color="primary" component="span">上傳圖片</Button>
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
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>{state.image3 ? <img alt={state.image3} src={URL.createObjectURL(state.image3)} height="400" width="600" /> : null}</TableCell>
                                            <TableCell align="right">
                                                {
                                                    state.image3 ?
                                                        <Button variant="contained" color="secondary" onClick={() => removeImagePreview("image3")}>移除圖片</Button>
                                                        :
                                                        <div>
                                                            <label htmlFor="createRoomImage3">
                                                                <Button variant="contained" color="primary" component="span">上傳圖片</Button>
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
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>{state.image4 ? <img alt={state.image4} src={URL.createObjectURL(state.image4)} height="400" width="600" /> : null}</TableCell>
                                            <TableCell align="right">
                                                {
                                                    state.image4 ? <Button variant="contained" color="secondary" onClick={() => removeImagePreview("image4")}>移除圖片</Button>
                                                        :
                                                        <div>
                                                            <label htmlFor="createRoomImage4">
                                                                <Button variant="contained" color="primary" component="span">上傳圖片</Button>
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
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>{state.image5 ? <img alt={state.image5} src={URL.createObjectURL(state.image5)} height="400" width="600" /> : null}</TableCell>
                                            <TableCell align="right">
                                                {state.image5 ?
                                                    <Button variant="contained" color="secondary" onClick={() => removeImagePreview("image5")}>移除圖片</Button>
                                                    :
                                                    <div>
                                                        <label htmlFor="createRoomImage5">
                                                            <Button variant="contained" color="primary" component="span">上傳圖片</Button>
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
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                        <CardActions>
                            <FormControl margin="normal" >
                                <Fab variant="extended" color="primary" onClick={() => handleSubmit()}>
                                    <NavigateNextIcon /> 確定並提交
                                </Fab>
                            </FormControl>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
            <Backdrop className={classes.backdrop} open={state.isCreating} >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div >
    )
}

export default CreateRoom

