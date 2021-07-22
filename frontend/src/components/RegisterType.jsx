import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

function RegisterType(props) {

    return (
        <Paper elevation={3}>
            <Grid container spacing={3} direction="column" alignItems="center">
                <Grid item>
                    <Typography variant="h6" align="center">{props.title}</Typography>
                    <Typography variant="subtitle1" align="center">{props.subtitle}</Typography>
                </Grid>
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
                <Grid item>
                    <Button component={Link} to={props.buttonGoto} variant="contained" color="primary">{props.buttonText}</Button>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default RegisterType