import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    card: {
        margin: '10px 0px 10px 0px'
    },
    button: {
        margin: '0px 0px 0px 500px'
    }
})

function Service(props) {
    const classes = useStyles()
    const { id } = useParams()
    return (
        <Card raised className={classes.card}>
            <CardContent>
                <List>
                    <ListItem>
                        <ListItemText
                            primary={'服務'}
                            secondary={props.serviceName}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={'備註'}
                            secondary={props.serviceRemark}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={'適合人數'}
                            secondary={`${props.serviceCapacity} 人`}
                        />
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary={'每小時收費'}
                            secondary={`$ ${props.servicePricing}`}
                        />
                    </ListItem>
                </List>
            </CardContent>
            <CardActions disableSpacing={true}>
                <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    component={Link}
                    to={`/room/${id}/service/${props.serviceId}/appointment`}
                >
                    租借
                </Button>
            </CardActions>
        </Card>
    )
}

export default Service