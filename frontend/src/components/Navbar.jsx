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
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Hidden from '@material-ui/core/Hidden';
import Slide from '@material-ui/core/Slide';
import CreateIcon from '@material-ui/icons/Create';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import ReceiptIcon from '@material-ui/icons/Receipt';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Sidebar from './Sidebar'

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
    const { state, handleLogout } = useContext(AuthenticationContext);
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
                            <Sidebar />
                        </Hidden>
                        <Hidden only={['xs', 'sm']}>
                            <div>
                                <Button component={NavLink} to="/" size="large" startIcon={<HomeIcon />}>主頁</Button>
                                <Button component={NavLink} to="/about" size="large" startIcon={<InfoIcon />}>關於我們</Button>
                                <Button component={NavLink} to="/room" size="large" startIcon={<RoomIcon />}>找琴房</Button>
                            </div>
                            <div>
                                {state.isAuthenticated ?
                                    <div>
                                        {state.permission === 'Owner' ? <Button component={NavLink} to="/appointment/search" size="large" startIcon={<AccessTimeIcon />}>尋找預訂</Button> : null}
                                        {state.permission === 'Owner' ? <Button component={NavLink} to="/appointment" size="large" startIcon={<AccessTimeIcon />}>管理預訂</Button> : null}
                                        {state.permission === 'Owner' ? <Button component={NavLink} to="/management" size="large" startIcon={<SettingsIcon />}>房間管理</Button> : null}
                                        {state.permission === 'Owner' ? <Button component={NavLink} to="/room/create" size="large" startIcon={<CreateIcon />}>建立新房間</Button> : null}
                                        {state.permission === 'Owner' ? null : <Button component={NavLink} to="/user/record" size='large' startIcon={<ReceiptIcon />}>紀錄</Button>}
                                        <Button component={NavLink} to="/user" size="large" startIcon={<PersonIcon />}>帳號管理</Button>
                                        <Button size="large" startIcon={<ExitToAppIcon />} onClick={handleClick}>登出</Button>
                                    </div>
                                    :
                                    <Button component={NavLink} to="/user/login" size="large" startIcon={<PersonIcon />}>註冊 / 登入</Button>}
                            </div>
                        </Hidden>
                    </Toolbar>
                </AppBar>
            </Slide>
        </div >
    )
}

export default Navbar