import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import axios from 'axios'

const marks = [
    {
        value: 0,
        label: '0',
    },
    {
        value: 1,
        label: '1',
    },
    {
        value: 2,
        label: '2',
    },
    {
        value: 3,
        label: '3',
    },
    {
        value: 4,
        label: '4'
    },
    {
        value: 5,
        label: '5'
    }
];

const useStyles = makeStyles(() => ({
    rating: {
        width: '150px'
    }
}))

function CreateReview() {
    const { enqueueSnackbar } = useSnackbar();
    const classes = useStyles()
    const { id } = useParams()
    const history = useHistory();
    const [state, setState] = useState({
        reviewBody: ''
    })
    const [rating, setRating] = useState(0)

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setState(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    const handleRate = (e, newValue) => {
        setRating(newValue)
    }

    const handleSubmit = async () => {
        try {
            const payload = {
                reviewBody: state.reviewBody,
                rating: rating
            }
            const res = await axios.post(`/room/${id}/review`, payload, {
                headers: {
                    'x-auth-token': window.localStorage.getItem('token')
                }
            })
            enqueueSnackbar('評價成功', { variant: 'success', autoHideDuration: 1500 })
            history.go(0)
        } catch (err) {
            enqueueSnackbar(`${err}`, { variant: 'success', autoHideDuration: 1500 })
        }
    }

    return (
        <Card>
            <CardContent>
                <div className={classes.rating}>
                    <Typography>評分</Typography>
                    <Slider
                        min={0}
                        max={5}
                        marks={marks}
                        name="rating"
                        value={state.rating}
                        onChange={handleRate}
                    />
                </div>
                <TextField
                    fullWidth
                    multiline
                    label="評價"
                    variant="outlined"
                    rows="5"
                    name="reviewBody"
                    value={state.reviewBody}
                    onChange={(e) => handleChange(e)}
                />
            </CardContent>
            <CardActions>
                <Button variant="contained" color="primary" onClick={() => handleSubmit()}>確定</Button>
            </CardActions>
        </Card>
    )
}

export default CreateReview