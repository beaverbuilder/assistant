import React, {useState, useEffect, Fragment} from 'fl-react'
import {Page, Button, Icon} from 'assistant/lib'

import PropTypes from 'prop-types'

import {__} from 'assistant'


export const ProfilePage = (props) => {

    const {doLogout, user, token} = props

    return (
        <Fragment>
            <p className="center-text">User Information:</p>
            <div style={{maxWidth: '90%', margin: 'auto'}}>
                <pre>{JSON.stringify(user, null, 4)}</pre>
                <pre>{JSON.stringify(token, null, 4)}</pre>
            </div>
            <div>
                <Button onClick={doLogout}>
                    Disconnect
                </Button>
            </div>
        </Fragment>
    )
};

ProfilePage.propTypes = {
    doLogout: PropTypes.func.isRequired,
    token: PropTypes.object,
    user: PropTypes.object
}

