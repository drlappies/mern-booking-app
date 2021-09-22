import React, { useEffect, useContext } from 'react';
import { AppointmentContext } from './contexts/AppointmentContext';
import { useParams } from 'react-router-dom'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import ImageGrid from './ImageGrid';
import ImageSlide from './ImageSlide'
import Hidden from '@material-ui/core/Hidden'
import Grid from '@material-ui/core/Grid'
import Service from './Service';
import Reviews from './Reviews'

const weekday = ['日', '一', '二', '三', '四', '五', '六',]

function RoomInfoPage() {
    const { fetchRoom, currentRoom } = useContext(AppointmentContext)
    const { id } = useParams();

    useEffect(() => {
        fetchRoom(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (

        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h3">{currentRoom.title}</Typography>
                    <Typography variant="h6">{currentRoom.description}</Typography>
                    <Typography variant="subtitle1">地址：{currentRoom.flat} 室 {currentRoom.floor} 樓 {currentRoom.building} {currentRoom.street} {currentRoom.region}</Typography>
                    <Typography variant="subtitle1">營業時間： {currentRoom.openingTime}:00 - {currentRoom.closingTime}:00</Typography>
                    <Typography variant="subtitle1">營業日子：逢星期{currentRoom.availableWeekday ? currentRoom.availableWeekday.map((el, i) => <span key={i}>&nbsp;{weekday[el]}&nbsp;</span>) : null}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Hidden only={['xl', 'lg', 'md']}>
                        <ImageSlide imgArr={currentRoom.image} />
                    </Hidden>
                    <Hidden only={['xs', 'sm']}>
                        <ImageGrid
                            img0={currentRoom.image.length ? currentRoom.image[0].url : ""}
                            img1={currentRoom.image.length ? currentRoom.image[1].url : ""}
                            img2={currentRoom.image.length ? currentRoom.image[2].url : ""}
                            img3={currentRoom.image.length ? currentRoom.image[3].url : ""}
                            img4={currentRoom.image.length ? currentRoom.image[4].url : ""}
                        />
                    </Hidden>
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                    <Service />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                    <Reviews roomId={id} />
                </Grid>
            </Grid>
        </Container>

    )
}

export default RoomInfoPage