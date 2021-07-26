import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { DropzoneArea } from 'material-ui-dropzone';
import Switch from '@material-ui/core/Switch';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles(() => ({
    root: {
        padding: '30px 30px 30px 30px'
    },
    img: {
        height: '150px',
        width: '300px'

    },
    service: {
        margin: '5px 0px 5px 0px'
    }
}))

function Roomview(props) {
    const classes = useStyles();
    const [deleteImage, setDeleteImage] = useState([]);
    const [isDelete, setIsDelete] = useState([false, false, false, false, false])
    const [form, setForm] = useState({
        title: props.title,
        description: props.description,
        street: props.street,
        floor: props.floor,
        flat: props.flat,
        building: props.building,
        region: props.region,
        openingTime: props.openingTime,
        closingTime: props.closingTime,
        monday: props.openWeekday.monday,
        tuesday: props.openWeekday.tuesday,
        wednesday: props.openWeekday.wednesday,
        thursday: props.openWeekday.thursday,
        friday: props.openWeekday.friday,
        saturday: props.openWeekday.saturday,
        sunday: props.openWeekday.sunday,
        imgurl: props.imgurl,
        imgkey: props.imgkey,
        services: props.services,
        isEditing: false
    })

    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name
        setForm(prevState => {
            return prevState = {
                ...prevState,
                [name]: value
            }
        })
    }

    const handleChangeService = (e, index) => {
        const name = e.target.name
        const value = e.target.value
        setForm(prevState => {
            return prevState = {
                ...prevState,
                services: prevState.services.map((el, i) => (index === i ? Object.assign(el, { [name]: value }) : el))
            }
        })
    }

    const handleChangeImage = (loadedFiles) => {
        setForm(prevState => {
            return prevState = {
                ...prevState,
                img: loadedFiles
            }
        })
    }

    const addDeleteImage = (key, url) => {
        setDeleteImage(prevState => {
            return prevState = prevState.concat({ key: key, url: url })
        })
    }

    const removeDeleteImage = (key, url) => {
        setDeleteImage(prevState => {
            return prevState = prevState.filter(el => el.key !== key && el.url !== url);
        })
    }

    const handleDeleteToggle = (index, key, url) => {
        setIsDelete(prevState => {
            return prevState = prevState.map((el, i) => (index === i ? prevState[i] = !prevState[i] : el))
        })
        if (isDelete[index]) {
            addDeleteImage(key, url);
        } else {
            removeDeleteImage(key, url);
        }
    }

    const handleToggle = (value) => {
        setForm(prevState => {
            return prevState = {
                ...prevState,
                [value]: !prevState[value]
            }
        })
    }

    const handleSubmit = async () => {
        try {
            const payload = {
                title: form.title,
                description: form.description,
                street: form.street,
                floor: form.floor,
                flat: form.flat,
                building: form.building,
                region: form.region,
                openingTime: form.openingTime,
                closingTime: form.closingTime,
                monday: form.monday,
                tuesday: form.tuesday,
                wednesday: form.wednesday,
                thursday: form.thursday,
                friday: form.friday,
                saturday: form.saturday,
                sunday: form.sunday,
            }
            const formData = new FormData();
            for (let key in payload) {
                formData.append(`${key}`, payload[key])
            }
            for (let key in form.img) {
                formData.append('image', form.img[key])
            }
            formData.append('deletedImages', JSON.stringify(deleteImage))
            const res = await axios.put(`/room/${props.id}`, formData, {
                headers: {
                    'content-type': 'multipart/form-data',
                    'x-auth-token': window.localStorage.getItem('token')
                }
            })
            console.log(res)
        } catch (err) {
            console.log(err)
        }
    }

    const handleCancel = () => {
        setForm(prevState => {
            return prevState = {
                title: props.title,
                description: props.description,
                street: props.street,
                floor: props.floor,
                flat: props.flat,
                building: props.building,
                region: props.region,
                openingTime: props.openingTime,
                closingTime: props.closingTime,
                monday: props.openWeekday.monday,
                tuesday: props.openWeekday.tuesday,
                wednesday: props.openWeekday.wednesday,
                thursday: props.openWeekday.thursday,
                friday: props.openWeekday.friday,
                saturday: props.openWeekday.saturday,
                sunday: props.openWeekday.sunday,
                imgurl: props.imgurl,
                imgkey: props.imgkey,
                services: props.services,
                isEditing: false
            }
        })
    }

    useEffect(() => {
        setForm(prevState => {
            return prevState = {
                title: props.title,
                description: props.description,
                street: props.street,
                floor: props.floor,
                flat: props.flat,
                building: props.building,
                region: props.region,
                openingTime: props.openingTime,
                closingTime: props.closingTime,
                monday: props.openWeekday.monday,
                tuesday: props.openWeekday.tuesday,
                wednesday: props.openWeekday.wednesday,
                thursday: props.openWeekday.thursday,
                friday: props.openWeekday.friday,
                saturday: props.openWeekday.saturday,
                sunday: props.openWeekday.sunday,
                imgurl: props.imgurl,
                imgkey: props.imgkey,
                services: props.services,
                isEditing: false
            }
        })
    }, [props.building, props.closingTime, props.description, props.flat, props.floor, props.img, props.imgkey, props.imgurl, props.openWeekday.friday, props.openWeekday.monday, props.openWeekday.saturday, props.openWeekday.sunday, props.openWeekday.thursday, props.openWeekday.tuesday, props.openWeekday.wednesday, props.openingTime, props.region, props.services, props.street, props.title])

    return (
        <div className={classes.root}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography align="right">
                        {form.isEditing ?
                            <span><Button variant="contained" color="primary" size="small" onClick={() => handleSubmit()}>確定修改</Button><Button variant="contained" color="primary" size="small" onClick={() => handleCancel()}>取消修改</Button></span>
                            :
                            <Button variant="contained" color="primary" size="small" onClick={() => handleToggle('isEditing')}>修改</Button>
                        }
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <List dense={true} subheader={<Typography>id</Typography>}>
                        <ListItem>
                            <ListItemText>{props.id}</ListItemText>
                        </ListItem>
                    </List>
                    <List dense={true} subheader={<Typography display="inline">房間名稱</Typography>}>
                        <ListItem>
                            {form.isEditing ?
                                <TextField
                                    margin="none"
                                    size="small"
                                    name="title"
                                    onChange={(e) => handleChange(e)}
                                    value={form.title}
                                />
                                :
                                <ListItemText>{form.title}</ListItemText>
                            }
                        </ListItem>
                    </List>
                    <List dense={true} subheader={<Typography>房間簡介</Typography>}>
                        <ListItem>
                            {form.isEditing ?
                                <TextField
                                    margin="none"
                                    size="small"
                                    name="description"
                                    multiline={true}
                                    rows={5}
                                    onChange={(e) => handleChange(e)}
                                    value={form.description}
                                />
                                :
                                <ListItemText>{form.description}</ListItemText>
                            }
                        </ListItem>
                    </List>
                    <List dense={true} subheader={<Typography>驗證</Typography>}>
                        <ListItem>
                            <ListItemText>{props.isVerified ? <div>已經驗證</div> : <div>尚未驗證</div>}</ListItemText>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={6}>
                    <List dense={true} subheader={<Typography>開放日期</Typography>}>
                        <ListItem>
                            <ListItemText>星期一</ListItemText>
                            <ListItemSecondaryAction>
                                <Switch
                                    onChange={() => handleToggle('monday')}
                                    checked={form.monday}
                                    disabled={!form.isEditing}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemText>星期二</ListItemText>
                            <ListItemSecondaryAction>
                                <Switch
                                    onChange={() => handleToggle('tuesday')}
                                    checked={form.tuesday}
                                    disabled={!form.isEditing}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemText>星期三</ListItemText>
                            <ListItemSecondaryAction>
                                <Switch
                                    onChange={() => handleToggle('wednesday')}
                                    checked={form.wednesday}
                                    disabled={!form.isEditing}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemText>星期四</ListItemText>
                            <ListItemSecondaryAction>
                                <Switch
                                    onChange={() => handleToggle('thursday')}
                                    checked={form.thursday}
                                    disabled={!form.isEditing}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemText>星期五</ListItemText>
                            <ListItemSecondaryAction>
                                <Switch
                                    onChange={() => handleToggle('friday')}
                                    checked={form.friday}
                                    disabled={!form.isEditing}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemText>星期六</ListItemText>
                            <ListItemSecondaryAction>
                                <Switch
                                    onChange={() => handleToggle('saturday')}
                                    checked={form.saturday}
                                    disabled={!form.isEditing}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                            <ListItemText>星期日</ListItemText>
                            <ListItemSecondaryAction>
                                <Switch
                                    onChange={() => handleToggle('sunday')}
                                    checked={form.sunday}
                                    disabled={!form.isEditing}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                    <List dense={true} subheader={<Typography>開放時間</Typography>}>
                        <ListItem>
                            {form.isEditing ?
                                <TextField
                                    margin="none"
                                    size="small"
                                    name="openingTime"
                                    type="number"
                                    onChange={(e) => handleChange(e)}
                                    value={form.openingTime}
                                />
                                :
                                <ListItemText primary={'開門時間'} secondary={`${form.openingTime}:00`} />
                            }
                        </ListItem>
                        <ListItem>
                            {form.isEditing ?
                                <TextField
                                    margin="none"
                                    size="small"
                                    name="closingTime"
                                    type="number"
                                    onChange={(e) => handleChange(e)}
                                    value={form.closingTime}
                                />
                                :
                                <ListItemText primary={'關門時間'} secondary={`${form.closingTime}:00`} />
                            }
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={12}>
                    <Typography>服務</Typography>
                    {form.services.map((el, i) =>
                        <Card key={i} className={classes.service}>
                            {form.isEditing ? null : <CardHeader title={el.name} />}
                            <CardContent>
                                {form.isEditing ?
                                    <TextField
                                        fullWidth
                                        label="服務名稱"
                                        name='name'
                                        onChange={(e) => handleChangeService(e, i)}
                                        value={form.services[i].name}
                                    />
                                    :
                                    null
                                }
                                {form.isEditing ?
                                    <TextField
                                        fullWidth
                                        label="備註"
                                        name='remark'
                                        onChange={(e) => handleChangeService(e, i)}
                                        value={form.services[i].remark}
                                    />
                                    :
                                    <Typography variant="subtitle2">備註：{el.remark ? el.remark : '沒有提供備註'}</Typography>
                                }
                                {form.isEditing ?
                                    <TextField
                                        label="價錢"
                                        name='pricing'
                                        onChange={(e) => handleChangeService(e, i)}
                                        value={form.services[i].pricing}
                                    />
                                    :
                                    <Typography variant="subtitle2">價錢：{el.pricing}/小時</Typography>
                                }
                            </CardContent>
                        </Card>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Typography>圖片</Typography>
                    {form.isEditing ?
                        <React.Fragment>
                            <Typography>刪除圖片</Typography>
                            <ImageList>
                                {props.imgurl.map((el, i) =>
                                    <ImageListItem key={i}>
                                        <img className={classes.img} src={el} alt={el} />
                                        <Checkbox value={isDelete[i]} onChange={() => handleDeleteToggle(i, form.imgkey[i], form.imgurl[i])} />
                                    </ImageListItem>
                                )}
                            </ImageList>
                            <Typography>新增圖片</Typography>
                            <DropzoneArea
                                acceptedFiles={['image/*']}
                                dropzoneText={"拖放或點擊"}
                                filesLimit={5}
                                maxFileSize={20000000}
                                showAlerts={false}
                                onChange={(loadedFiles) => handleChangeImage(loadedFiles)}
                            />
                        </React.Fragment>
                        :
                        <ImageList>
                            {props.imgurl.map((el, i) =>
                                <ImageListItem key={i}>
                                    <img src={el} alt={el} />
                                </ImageListItem>
                            )}
                        </ImageList>
                    }
                </Grid>
            </Grid>
        </div>
    )
}

export default Roomview