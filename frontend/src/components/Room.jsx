import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ScheduleIcon from '@material-ui/icons/Schedule';
import PersonIcon from '@material-ui/icons/Person';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import InfoIcon from '@material-ui/icons/Info';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Box from '@material-ui/core/Box'
import ButtonGroup from '@material-ui/core/ButtonGroup';

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        flexWrap: "wrap",
        marginBottom: 10
    },
    content: {
        display: "flex",
        flexDirection: "column"
    },
    media: {
        height: 200,
        width: 300
    },
    link: {
        textDecoration: "none",
        color: "black"
    }
})

function Room(props) {
    const classes = useStyles()
    return (
        <Card className={classes.root}>
            <CardMedia
                className={classes.media}
                image={props.img}
            />
            <Box className={classes.content}>
                <CardContent >
                    <List dense={true} disablePadding={true}>
                        <ListItemText>
                            <Typography variant="h6">
                                {props.title}
                            </Typography>
                        </ListItemText>
                        <ListItem>
                            <ListItemIcon>
                                <ScheduleIcon />
                            </ListItemIcon>
                            <ListItemText>
                                營業時間 - {props.openingHour}:00 - {props.closingHour}:00
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText>
                                聯絡人 - {props.owner}
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <ContactSupportIcon />
                            </ListItemIcon>
                            <ListItemText>
                                查詢 - {props.contact}
                            </ListItemText>
                        </ListItem>
                    </List>
                </CardContent>
                <CardActions>
                    <ButtonGroup fullWidth={true}>
                        <Button component={Link} to={`/room/${props.roomId}`} endIcon={<InfoIcon />}>查詢</Button>
                    </ButtonGroup>
                </CardActions>
            </Box>
        </Card >
    )
}

export default Room