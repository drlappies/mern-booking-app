import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';

const useStyles = makeStyles(() => ({
    media: {
        height: 0,
        paddingTop: '56.25%',
    },
}));

function Room(props) {
    const classes = useStyles();
    const history = useHistory()
    return (
        <Card raised>
            <CardActionArea onClick={() => history.push(`/room/${props.roomId}`)}>
                <CardMedia image={props.img} className={classes.media} />
                <CardHeader title={props.title} subheader={`營業時間 ${props.openingHour}:00 - ${props.closingHour}:00`} />
            </CardActionArea>
        </Card >
    )
}

export default Room