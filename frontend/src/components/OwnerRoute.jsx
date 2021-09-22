import React, { useContext, useEffect } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext';
import { Route, Redirect } from 'react-router-dom'

function OwnerRoute({ component: Component, ...rest }) {
    const { state, fetchUser } = useContext(AuthenticationContext);

    useEffect(() => {
        fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Route
            {...rest}
            render={props => (
                (state.isAuthenticated ?
                    (state.permission === 'Owner'
                        ?
                        <Component {...props} />
                        :
                        <Redirect to="/" />)
                    :
                    <Redirect to="/" />)
            )}
        />
    )
}

export default OwnerRoute