import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import ImageGrid from './ImageGrid';
import ImageSlide from './ImageSlide'
import Hidden from '@material-ui/core/Hidden'
import Grid from '@material-ui/core/Grid'
import Service from './Service';
import Review from './Review';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(({
    sort: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
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
    const classes = useStyles()
    const { id } = useParams();
    const [header, setHeader] = useState({});
    const [review, setReview] = useState([]);
    const [img, setImg] = useState([]);
    const [service, setService] = useState([]);
    const [availableWeekday, setAvailableWeekday] = useState([]);
    const [openingTime, setOpeningTime] = useState(9);
    const [closingTime, setClosingTime] = useState(23);
    const [sort, setSort] = useState('earliest');

    useEffect(() => {
        fetchRoom()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchRoom = async () => {
        const res = await axios.get(`/room/${id}`)
        setHeader(res.data)
        setReview(res.data.reviews)
        setImg(res.data.imageUrl)
        setService(res.data.services)
        setAvailableWeekday(res.data.openWeekday);
        setOpeningTime(res.data.openingTime);
        setClosingTime(res.data.closingTime);
    }

    const handleChange = (event) => {
        setSort(event.target.value)
        setReview(review.reverse())
    }
    const availability = useMemo(() => checkIsDayOpen(availableWeekday), [availableWeekday])

    return (
        <Container>
            <Typography variant="h3">{header.title}</Typography>
            <Typography variant="h6">{header.description}</Typography>
            <Typography variant="subtitle1">營業時間：{openingTime}:00 - {closingTime}:00</Typography>
            <Typography variant="subtitle1">營業日子：逢星期{availability.map((el, i) => <span key={i}>&nbsp;{weekday[el]}&nbsp;</span>)}</Typography>
            <Hidden only={['xl', 'lg', 'md']}>
                <ImageSlide imgArr={img} />
            </Hidden>
            <Hidden only={['xs', 'sm']}>
                <ImageGrid
                    img0={img[0]}
                    img1={img[1]}
                    img2={img[2]}
                    img3={img[3]}
                    img4={img[4]}
                />
            </Hidden>
            <Grid container spacing={7}>
                <Grid item md={6} sm={12} xs={12}>
                    <Typography variant="h6">服務資訊：</Typography>
                    {service.map(el =>
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
                    <div className={classes.sort}>
                        <Typography variant="h6">用家評價：</Typography>
                        <Select value={sort} onChange={handleChange}>
                            <MenuItem value={'latest'}>顯示最新</MenuItem>
                            <MenuItem value={'earliest'}>顯示最舊</MenuItem>
                        </Select>
                    </div>
                    {!review ?
                        <div>
                            {review.map(el =>
                                <Review
                                    key={el._id}
                                    author={el.author.username}
                                    reviewBody={el.reviewBody}
                                    rating={el.rating}
                                    createdAt={el.createdAt}
                                />
                            )}
                        </div> : <Typography>暫時沒有留言</Typography>}

                </Grid>
            </Grid>
        </Container>
    )
}

export default RoomInfoPage