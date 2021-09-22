import React from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

function RegisterType(props) {

    return (
        <Card raised>
            <CardHeader title={props.title} subheader={props.subtitle} />
            <CardContent>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            {props.feature1icon}
                        </ListItemIcon>
                        <ListItemText>{props.feature1}</ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            {props.feature2icon}
                        </ListItemIcon>
                        <ListItemText>{props.feature2}</ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            {props.feature3icon}
                        </ListItemIcon>
                        <ListItemText>{props.feature3}</ListItemText>
                    </ListItem>
                </List>
            </CardContent>
            <CardActions>
                <Button component={Link} to={props.buttonGoto} variant="contained" color="primary" fullWidth>{props.buttonText}</Button>
            </CardActions>
        </Card>
    )
}

export default RegisterType