import React, { useEffect, useState } from 'react';
import Room from './Room'
import axios from 'axios';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

function Catalog() {
    const [room, setRoom] = useState([]);

    useEffect(() => {
        fetchRooms()
    }, [])

    const fetchRooms = async () => {
        const res = await axios.get('/room');
        setRoom(res.data)
    }

    return (
        <Container >
            <Grid container spacing={3} direction="row">
                {room.map(el => (
                    <Grid item sm={12} md={3} key={el._id}>
                        <Room
                            roomId={el._id}
                            img={el.imageUrl[0]}
                            owner={el.owner.username}
                            contact={el.owner.number}
                            openingHour={el.openingTime}
                            closingHour={el.closingTime}
                            title={el.title}
                            region={el.address.region}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container >
    )
}

export default Catalog