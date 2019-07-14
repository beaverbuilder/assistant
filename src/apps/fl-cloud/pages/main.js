import React, {useState, useEffect} from 'fl-react'
import {Switch, Route, Redirect, Link, withRouter} from 'fl-react-router-dom'

import {ProfilePage} from './profile'
import {DisconnectPage} from './disconnect'

export const CloudMain = ({match}) => {
    return (
        <Switch>
            <Route exact path={`${match.url}/`} component={ProfilePage}/>
            <Route path={`${match.url}/disconnect`} component={DisconnectPage}/>
        </Switch>
    );
}

