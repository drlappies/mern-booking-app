import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext';
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import ImageGrid from './ImageGrid';
import ImageSlide from './ImageSlide'
import Hidden from '@material-ui/core/Hidden'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Service from './Service';
import Review from './Review';
import CreateReview from './CreateReview'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(({
    text: {
        margin: '5px 0px 5px 0px'
    },
    comment: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
}))

const weekday = [
    '日',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
]

function checkIsDayOpen(availableWeekday) {
    const availability = [];
    let increment = 0;
    for (let key in availableWeekday) {
        if (availableWeekday[key]) {
            availability.push(increment);
        }
        increment = increment + 1;
    }

    return availability;
}

function RoomInfoPage() {
    const context = useContext(AuthenticationContext)
    const classes = useStyles()
    const { id } = useParams();
    const [state, setState] = useState({
        title: '',
        description: '',
        owner: '',
        street: '',
        floor: '',
        flat: '',
        building: '',
        region: '',
        openingTime: 0,
        closingTime: 0,
        availabileWeekday: [],
        image: [],
        service: [],
        review: [],
        isReviewing: false
    });

    const fetchRoom = useCallback(async () => {
        const res = await axios.get(`/room/${id}`)
        setState({
            title: res.data.title,
            description: res.data.description,
            owner: res.data.owner.title,
            street: res.data.address.street,
            floor: res.data.address.floor,
            flat: res.data.address.flat,
            building: res.data.address.building,
            region: res.data.address.region,
            openingTime: res.data.openingTime,
            closingTime: res.data.closingTime,
            availableWeekday: res.data.openWeekday,
            image: res.data.imageUrl,
            service: res.data.services,
            review: res.data.reviews,
            isReviewing: false
        })
        console.log(res.data.reviews)
    }, [id])

    const handleReview = () => {
        setState(prevState => {
            return {
                ...prevState,
                isReviewing: !prevState.isReviewing
            }
        })
    }

    useEffect(() => {
        fetchRoom()
    }, [fetchRoom]);

    const availability = useMemo(() => checkIsDayOpen(state.availableWeekday), [state.availableWeekday])

    return (
        <Container>
            <Typography className={classes.text} variant="h3">{state.title}</Typography>
            <Typography className={classes.text} variant="h6">{state.description}</Typography>
            <Typography className={classes.text} variant="subtitle1">提供者：{state.owner}</Typography>
            <Typography className={classes.text} variant="subtitle1">地址：{state.flat} 室 {state.floor} 樓 {state.building} {state.street} {state.region}</Typography>
            <Typography className={classes.text} variant="subtitle1">營業時間： {state.openingTime}:00 - {state.closingTime}:00</Typography>
            <Typography className={classes.text} variant="subtitle1">營業日子：逢星期{availability.map((el, i) => <span key={i}>&nbsp;{weekday[el]}&nbsp;</span>)}</Typography>
            <Hidden only={['xl', 'lg', 'md']}>
                <ImageSlide imgArr={state.image} />
            </Hidden>
            <Hidden only={['xs', 'sm']}>
                <ImageGrid
                    img0={state.image[0]}
                    img1={state.image[1]}
                    img2={state.image[2]}
                    img3={state.image[3]}
                    img4={state.image[4]}
                />
            </Hidden>
            <Grid container spacing={7}>
                <Grid item md={6} sm={12} xs={12}>
                    <Typography className={classes.text} variant="h6">服務資訊</Typography>
                    {state.service.map(el =>
                        <Service
                            key={el._id}
                            serviceId={el._id}
                            serviceName={el.name}
                            servicePricing={el.pricing}
                            serviceCapacity={el.capacity}
                            serviceRemark={el.remark}
                        />
                    )}
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                    <div className={classes.comment}>
                        <Typography className={classes.text} variant="h6">用家評價</Typography>
                        <Button onClick={() => handleReview()}>建立評價</Button>
                    </div>

                    {state.isReviewing ?
                        <CreateReview />
                        :
                        state.review.map(el =>
                            <Review
                                key={el._id}
                                author={el.author.username}
                                reviewBody={el.reviewBody}
                                rating={el.rating}
                                createdAt={el.createdAt}
                            />
                        )
                    }
                    {state.review.length ? null : <Typography variant="subtitle2" align="center">暫時沒有留言</Typography>}
                </Grid>
            </Grid>
        </Container>
    )
}

export default RoomInfoPage