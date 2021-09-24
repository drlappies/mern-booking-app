import React, { useEffect, useCallback, useState, useContext } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext'
import Review from './Review';
import CreateReview from './CreateReview'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { useSnackbar } from 'notistack';
import axios from 'axios'

function Reviews(props) {
    const { enqueueSnackbar } = useSnackbar();
    const auth = useContext(AuthenticationContext);
    const { roomId } = props;
    const [state, setState] = useState({
        reviews: [],
        isReviewing: false
    })

    const fetchReviews = useCallback(async () => {
        try {
            const res = await axios.get(`/api/room/${roomId}/review`)
            setState(prevState => { return { ...prevState, reviews: res.data, isReviewing: false } })
        } catch (err) {
            enqueueSnackbar(err.response.data.error, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
        }
    }, [enqueueSnackbar, roomId])

    const toggleReviewing = () => {
        setState(prevState => { return { ...prevState, isReviewing: !prevState.isReviewing } })
    }

    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

    return (
        <Grid container spacing={1}>
            <Grid item><Typography paragraph variant="h6">用家評價</Typography></Grid>
            <Grid item>{auth.state.permission === 'Finder' ? <Button color={state.isReviewing ? "secondary" : "primary"} variant="contained" size="small" onClick={toggleReviewing}>{state.isReviewing ? "取消" : "建立評價"}</Button> : null}</Grid>
            <Grid item xs={12}> {state.isReviewing ? <CreateReview fetchReviews={fetchReviews} /> : null}</Grid>
            {state.reviews.map((el, i) =>
                <Grid item xs={12} key={i}>
                    <Review body={el.body} createdAt={el.createdAt} author={el.author.name} />
                </Grid>
            )}
        </Grid>
    )
}

export default Reviews