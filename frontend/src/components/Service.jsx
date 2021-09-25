import React, { useContext } from 'react';
import { AppointmentContext } from './contexts/AppointmentContext';
import { AuthenticationContext } from './contexts/AuthenticationContext';
import { Link, useParams } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

function Service() {
    const { currentRoom } = useContext(AppointmentContext)
    const { state } = useContext(AuthenticationContext)
    const { id } = useParams()

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography paragraph variant="h6">服務選項</Typography>
            </Grid>
            {currentRoom.service.length <= 0 ?
                <Grid item xs={12}>
                    <Card raised>
                        <CardContent>
                            <Grid container justifyContent="center">
                                <Grid item>
                                    <Typography variant="body1">
                                        此房間暫時沒有提供如何服務 :/
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                :
                currentRoom.service.map((el, i) =>
                    <Grid item key={i} xs={12}>
                        <Card raised>
                            <CardHeader title={el.name} subheader={el.remark} />
                            <CardContent>
                                <Typography variant="subtitle2">${el.pricing} / 小時</Typography>
                                <Typography variant="subtitle2">適合{el.capacity}人使用</Typography>
                            </CardContent>
                            <CardActions>
                                {state.permission === 'Finder' ? <Button color="primary" variant="contained" component={Link} to={`/room/${id}/service/${el._id}/appointment`}>租借</Button> : null}
                            </CardActions>
                        </Card>
                    </Grid>
                )}
        </Grid>
    )
}

export default Service