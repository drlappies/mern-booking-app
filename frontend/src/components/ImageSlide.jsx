import React from 'react';
import { makeStyles } from '@material-ui/core';
import Carousel from 'react-material-ui-carousel';

const useStyles = makeStyles(({
    img: {
        width: "100%",
        height: 400
    }
}))

function ImageSlide(props) {
    const classes = useStyles()
    const items = props.imgArr
    return (
        <Carousel animation="slide" swipe={true} autoPlay={false}>
            {items.map((item, i) => <img className={classes.img} key={i} src={item} alt="" />)}
        </Carousel>
    )
}

export default ImageSlide