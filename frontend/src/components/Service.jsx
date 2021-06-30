import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionActions from '@material-ui/core/AccordionActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import GroupIcon from '@material-ui/icons/Group';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import Button from '@material-ui/core/Button';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    accordion: {
        margin: "10px 0"
    },
    accordionDetails: {
        padding: "0 16px"
    },
})

function Service(props) {
    const classes = useStyles()
    const { id } = useParams()
    return (
        <Accordion classes={{ root: classes.accordion }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{props.serviceName}</Typography>
            </AccordionSummary>
            <AccordionDetails classes={{ root: classes.accordionDetails }}>
                <List>
                    <ListItem dense={true}>
                        <ListItemIcon>
                            <AttachMoneyIcon />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography>租金：{props.servicePricing} / 每小時</Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem dense={true}>
                        <ListItemIcon>
                            <GroupIcon />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography>最高人數：{props.serviceCapacity}</Typography>
                        </ListItemText>
                    </ListItem>
                    {props.serviceRemark ?
                        <ListItem dense={true}>
                            <ListItemIcon>
                                <AnnouncementIcon />
                            </ListItemIcon>
                            <ListItemText>
                                <Typography>備註：{props.serviceRemark}</Typography>
                            </ListItemText>
                        </ListItem> : null}
                </List>
            </AccordionDetails>
            <AccordionActions disableSpacing={true}>
                <Button component={Link} to={`/room/${id}/service/${props.serviceId}/appointment`} endIcon={<KeyboardArrowRightIcon />}>租借</Button>
            </AccordionActions>
        </Accordion >
    )
}

export default Service