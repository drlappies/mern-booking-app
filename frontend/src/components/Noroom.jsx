import React from 'react';
import { useHistory } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Grid from '@material-ui/core/Grid'

function Noroom(props) {
    const history = useHistory();

    return (
        <Grid container justifyContent="center">
            <Grid item>
                <Card>
                    <CardHeader title="此帳號暫時沒有房間 :'(" />
                    <CardContent>
                        <Typography>此帳號暫時沒有房間，因此不能進入{props.block}。</Typography>
                    </CardContent>
                    <CardActions>
                        <Button color="primary" variant="contained" endIcon={<ArrowForwardIosIcon />} onClick={() => history.push('/room/create')}>創建房間</Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Noroom