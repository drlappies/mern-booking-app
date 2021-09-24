import React, { useEffect, useState, useCallback } from 'react';
import Room from './Room'
import axios from 'axios';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { useSnackbar } from 'notistack';

function Catalog() {
    const { enqueueSnackbar } = useSnackbar()
    const [state, setState] = useState([])

    const fetchRooms = useCallback(async () => {
        try {
            const res = await axios.get('/api/room');
            setState(res.data)
        } catch (err) {
            enqueueSnackbar(err.response.data.error, { variant: 'error', autoHideDuration: 1500, anchorOrigin: { vertical: 'top', horizontal: 'center' }, preventDuplicate: true })
        }
    }, [enqueueSnackbar])

    useEffect(() => {
        fetchRooms()
    }, [fetchRooms])


    return (
        <Container >
            <Grid container spacing={1} direction="row">
                {state.map((el, i) => (
                    <Grid item xs={12} sm={12} md={4} lg={3} xl={3} key={i}>
                        <Room
                            img={el.images[0].url}
                            roomId={el._id}
                            owner={el.owner.username}
                            contact={el.owner.number}
                            openingHour={el.openingTime}
                            closingHour={el.closingTime}
                            title={el.title}
                            address={el.address}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container >
    )
}

export default Catalog