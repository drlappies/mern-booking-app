import React, { useContext } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext'
import { NavLink } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/Appbar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';
import RoomIcon from '@material-ui/icons/Room';
import PersonIcon from '@material-ui/icons/Person';
import Dropdown from '../components/Dropdown';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Hidden from '@material-ui/core/Hidden';
import Slide from '@material-ui/core/Slide';
import CreateIcon from '@material-ui/icons/Create';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles(() => ({
    root: {
        marginBottom: 80
    },
    nav: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    }
}));

function Navbar() {
    const { isAuthenticated, handleLogout } = useContext(AuthenticationContext);
    const classes = useStyles()
    const isScrolled = useScrollTrigger();

    const handleClick = (e => {
        handleLogout();

    })

    return (
        <div className={classes.root}>
            <Slide appear={false} direction="down" in={!isScrolled}>
                <AppBar color="transparent" elevation={0}>
                    <Toolbar className={classes.nav}>
                        <Typography variant="h6">自助琴房租務平台</Typography>
                        <Hidden only={['xl', 'lg', 'md']}>
                            <Dropdown />
                        </Hidden>
                        <Hidden only={['xs', 'sm']}>
                            <div>
                                <Button component={NavLink} to="/" size="large" startIcon={<HomeIcon />}>主頁</Button>
                                <Button component={NavLink} to="/about" size="large" startIcon={<InfoIcon />}>關於我們</Button>
                                <Button component={NavLink} to="/room" size="large" startIcon={<RoomIcon />}>找琴房</Button>
                            </div>
                            <div>
                                {isAuthenticated ?
                                    <div>
                                        {isAuthenticated ? <Button component={NavLink} to="/room/create" size="large" startIcon={<CreateIcon />}>建立新房間</Button> : null}
                                        <Button size="large" startIcon={<ExitToAppIcon />} onClick={handleClick}>登出</Button>
                                    </div>
                                    :
                                    <Button component={NavLink} to="/login" size="large" startIcon={<PersonIcon />}>註冊 / 登入</Button>}
                            </div>
                        </Hidden>
                    </Toolbar>
                </AppBar>
            </Slide>
        </div >
    )
}

export default Navbar