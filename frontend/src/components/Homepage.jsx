import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(() => ({
    textBox: {
        padding: "2em",
    },
}))

function Homepage() {
    const classes = useStyles();
    return (
        <Container>
            <Grid container>
                <Grid item md={6}>
                    <Box className={classes.textBox}>
                        <Typography variant="h4">玩音樂由這裏開始</Typography>
                        <Typography>快笑香，山坐種海的想長勢因加間？查紅色特德認實。生始質因良中足國的，利是候發代訴件雙性不戰了幾有這便驚，我應長用未，所會即我的亮知是？</Typography>
                        <Button component={Link} to="/room" size="large" endIcon={<PlayArrowIcon />}>帶我去找琴房</Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Homepage