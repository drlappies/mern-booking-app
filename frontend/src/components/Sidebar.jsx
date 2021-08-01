import React, { useState, useContext } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext'
import { Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import AppsIcon from '@material-ui/icons/Apps';
import InfoIcon from '@material-ui/icons/Info';
import RoomIcon from '@material-ui/icons/Room';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';
import CreateIcon from '@material-ui/icons/Create';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LockOpenIcon from '@material-ui/icons/LockOpen';

function Sidebar() {
    const { state, handleLogout } = useContext(AuthenticationContext)
    const [isOpen, setIsOpen] = useState(false)

    const toggleDrawer = (e) => {
        if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'shift')) {
            return;
        }
        setIsOpen(!isOpen)
    }

    return (
        <div>
            <IconButton onClick={(e) => toggleDrawer(e)}>
                <MenuIcon />
            </IconButton>
            <Drawer open={isOpen} onClose={(e) => toggleDrawer(e)}>
                <List>
                    <ListItem button component={Link} to='/'>
                        <ListItemIcon>
                            <AppsIcon />
                        </ListItemIcon>
                        <ListItemText primary={'主頁'} />
                    </ListItem>
                    <ListItem button component={Link} to='/about'>
                        <ListItemIcon>
                            <InfoIcon />
                        </ListItemIcon>
                        <ListItemText primary={'關於我們'} />
                    </ListItem>
                    <ListItem button component={Link} to='/room'>
                        <ListItemIcon>
                            <RoomIcon />
                        </ListItemIcon>
                        <ListItemText primary={'找房間'} />
                    </ListItem>
                </List>
                <Divider />
                {state.isAuthenticated ?
                    <List>
                        <ListItem button component={Link} to="/user">
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary={'帳號管理'} />
                        </ListItem>
                        <ListItem button component={Link} to="/room/management">
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary={'房間管理'} />
                        </ListItem>
                        <ListItem button component={Link} to="/room/create">
                            <ListItemIcon>
                                <CreateIcon />
                            </ListItemIcon>
                            <ListItemText primary={'建立新房間'} />
                        </ListItem>
                        <ListItem button onClick={() => handleLogout()}>
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary={'登出'} />
                        </ListItem>
                    </List>
                    :
                    <List>
                        <ListItem button component={Link} to="/login">
                            <ListItemIcon>
                                <LockOpenIcon />
                            </ListItemIcon>
                            <ListItemText primary={'登入/註冊'} />
                        </ListItem>
                    </List>
                }
            </Drawer>
        </div>
    )
}

export default Sidebar