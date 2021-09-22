import React, { useState, useContext } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext'
import { useParams } from 'react-router-dom'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { useSnackbar } from 'notistack';
import axios from 'axios'

function CreateReview(props) {
    const { fetchReviews } = props;
    const auth = useContext(AuthenticationContext)
    const { enqueueSnackbar } = useSnackbar();
    const { id } = useParams()
    const [state, setState] = useState({
        body: '',
    })

    const handleChange = (e, nv) => {
        let name = e.target.name
        let value = e.target.value
        setState(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        })
    }

    const handleSubmit = async () => {
        try {
            auth.fetchUser()
            if (auth.state.permission !== 'Finder') return;
            
            const payload = {
                body: state.body,
            }
            const res = await axios.post(`/api/room/${id}/review`, payload, {
                headers: { 'x-auth-token': window.localStorage.getItem('token') }
            })
            enqueueSnackbar(res.data.success, { variant: 'success', autoHideDuration: 1500 })
            return fetchReviews()
        } catch (err) {
            enqueueSnackbar(err.response.data.error, { variant: 'error', autoHideDuration: 1500 })
        }
    }

    return (
        <Card>
            <CardContent>
                <Grid container>
                    <Grid item xs={12}>
                        <TextField fullWidth margin="normal" multiline label="評價" variant="outlined" rows="5" name="body" value={state.body} onChange={handleChange} />
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button variant="contained" color="primary" onClick={() => handleSubmit()}>確定</Button>
            </CardActions>
        </Card>
    )
}

export default CreateReview