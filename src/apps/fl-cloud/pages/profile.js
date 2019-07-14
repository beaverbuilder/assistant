import React, {useState, useEffect} from 'fl-react'
import {Page, Button, Icon} from 'assistant/lib'
import { __ } from 'assistant'
import { useSystemState, getSystemActions } from "assistant/store";

export const ProfilePage = () => {
    const { cloudUser, cloudToken } = useSystemState();

    return (
        <Page className="fl-app-cloud">
            <Button.Group>
                <Button disabled>{__('Profile')}</Button>
                <Button to={`/fl-cloud/disconnect`}>{__('Disconnect')}</Button>
            </Button.Group>
            <p className="center-text">User Information:</p>
            <div style={{maxWidth: '90%', margin: 'auto'}}>
                <pre>{JSON.stringify(cloudUser, null, 4)}</pre>
                <pre>{JSON.stringify(cloudToken, null, 4)}</pre>
            </div>

        </Page>
    )
};
