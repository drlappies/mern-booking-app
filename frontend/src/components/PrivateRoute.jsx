import React, { useContext, useEffect } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext';
import { Route, Redirect } from 'react-router-dom';

function PrivateRoute({ component: Component, ...rest }) {
    const { state, fetchUser } = useContext(AuthenticationContext)

    useEffect(() => {
        fetchUser()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Route
            {...rest}
            render={props => (
                state.isAuthenticated ?
                    <Component {...props} />
                    :
                    <Redirect to="/" />
            )}
        />
    )

}

export default PrivateRoute