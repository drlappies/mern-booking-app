import React, { useState, useContext } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(() => ({
    menuItem: {
        textDecoration: "none",
        color: "black"
    }
}));

function Dropdown() {
    const { isLoggedIn, handleLogout } = useContext(AuthenticationContext);
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCloseAndLogout = () => {
        setAnchorEl(null);
        handleLogout()
    }
    return (
        <React.Fragment>
            <Button aria-controls="menu" aria-haspopup="true" onClick={handleClick}>
                <MenuIcon />
            </Button>
            <Menu
                id="menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}><Link className={classes.menuItem} to="/">主頁</Link></MenuItem>
                <MenuItem onClick={handleClose}><Link className={classes.menuItem} to="/about">關於我們</Link></MenuItem>
                <MenuItem onClick={handleClose}><Link className={classes.menuItem} to="/room">搜尋琴房</Link></MenuItem>
                {isLoggedIn
                    ?
                    <MenuItem onClick={handleCloseAndLogout}><Link className={classes.menuItem} to="/"> 登出 </Link></MenuItem>
                    :
                    <MenuItem onClick={handleClose}><Link className={classes.menuItem} to="/login"> 登入 / 註冊 </Link></MenuItem>
                }

            </Menu>
        </React.Fragment>
    )
}

export default Dropdown