import React, {useState, useEffect} from 'fl-react'
import {Page, Button, Icon} from 'assistant/lib'
import {__} from 'assistant'
import {useSystemState, getSystemActions} from "assistant/store";


import cloud from 'assistant/cloud'

export const ProfilePage = (props) => {

    return (
        <Page className="fl-app-cloud">
            <p className="center-text">User Information:</p>
            <div style={{maxWidth: '90%', margin: 'auto'}}>
                <pre>{JSON.stringify(cloud.currentUser.getToken(), null, 4)}</pre>
            </div>
            <div>
                <Button onClick={e => props.onDisconnect()}>Disconnect</Button>
            </div>
        </Page>
    )

};
