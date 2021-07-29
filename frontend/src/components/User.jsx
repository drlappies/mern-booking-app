import React, { useState, useEffect, useContext, useCallback } from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Selleronboard from './Selleronboard';
import axios from 'axios'

function User() {
    console.log('user renders')
    const [state, setState] = useState({
        isLoading: true,
        isOnboarding: false,
        linkReceived: false,
        isOnboarded: false,
        self_link: '',
        action_link: '',
    });

    const handleOnboard = async () => {
        try {
            const res = await axios.get('/user/onboard', {
                headers: {
                    'x-auth-token': window.localStorage.getItem('token')
                }
            })
            setState(prevState => {
                return {
                    ...prevState,
                    linkReceived: true,
                    self_link: res.data.self_url,
                    action_link: res.data.action_url
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    const fetchOnboardStatus = useCallback(async () => {
        try {
            const res = await axios.get('/user/onboard/status', {
                headers: {
                    'x-auth-token': window.localStorage.getItem('token')
                }
            })
            setState(prevState => {
                return {
                    ...prevState,
                    isOnboarded: res.data.status
                }
            })
        } catch (err) {
            console.log(err)
        }
    }, [])

    useEffect(() => {
        fetchOnboardStatus()
    }, [fetchOnboardStatus])

    return (
        <Container>
            {!state.linkReceived ?
                <Button onClick={() => handleOnboard()}>驗證</Button>
                :
                <Selleronboard action_link={state.action_link} />
            }
            <div>{state.isOnboarded ? 'onboarded' : 'not onboarded'}</div>
        </Container>
    )
}

export default User