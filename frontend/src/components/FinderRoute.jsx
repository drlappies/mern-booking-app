import React, { useContext } from 'react';
import { AuthenticationContext } from './contexts/AuthenticationContext';
import { Route, Redirect } from 'react-router-dom'

function OwnerRoute({ component: Component, ...rest }) {
    const { state } = useContext(AuthenticationContext);
    return (
        <Route
            {...rest}
            render={props => (
                (state.isAuthenticated ?
                    (state.permission === 'Finder'
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