import React, { useState, useEffect, useCallback } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack';

const useStyles = makeStyles(() => ({
    img_wrapper: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    img: {
        width: '300px',
        height: '150px',
        margin: '5px 5px 5px 5px'
    }
}))

function Roomimage(props) {
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles()
    const [state, setState] = useState({
        image: [],
    })

    const fetchData = useCallback(async () => {
        try {
            const res = await axios.get(`/room/${props.id}`);
            let image = [];
            for (let i = 0; i < res.data.imageUrl.length; i++) {
                let obj = {
                    imageUrl: res.data.imageUrl[i],
                    imageKey: res.data.imageKey[i]
                };
                image.push(obj)
            }
            setState(prevState => ({
                ...prevState,
                image: image
            }
            ))
        } catch (err) {
            console.log(err)
        }
    }, [props.id])

    const handleUpload = async (e, url, key) => {
        try {
            const file = e.target.files[0]
            const formData = new FormData();
            formData.append('image', file);
            formData.append('deletedImage', JSON.stringify({
                imageUrl: url,
                imageKey: key
            }))
            await axios.put(`/room/${props.id}`, formData, {
                headers: {
                    'content-type': 'multipart/form-data',
                    'x-auth-token': window.localStorage.getItem('token')
                }
            })
            fetchData();
            enqueueSnackbar('更新成功', { variant: 'success', autoHideDuration: 1500 })
        } catch (err) {
            enqueueSnackbar(`錯誤${err}`, { variant: 'error', autoHideDuration: 1500 })
            console.log(err)
        }
    }

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <div>
            <List dense={true} subheader={<Typography>圖片</Typography>}>
                {state.image.map((el, i) =>
                    <ListItem key={i}>
                        <img className={classes.img} src={el.imageUrl} alt={el.imageUrl} />
                        <ListItemSecondaryAction>
                            <Button component="label">
                                更新
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => handleUpload(e, el.imageUrl, el.imageKey)}
                                />
                            </Button>
                        </ListItemSecondaryAction>
                    </ListItem>
                )}
            </List>
        </div>
    )
}

export default Roomimage