import React, {useState, useEffect} from 'fl-react'
import {withRouter} from 'fl-react-router-dom'
import {__} from 'assistant'
import {Page, Button, Icon} from 'assistant/lib'
import LogoutButton from "../components/logout-button";

export const DisconnectPage = () => {
    return (
        <Page className="fl-app-cloud">
            <Button.Group>
                <Button to={`/fl-cloud/`}>{__('Profile')}</Button>
                <Button disabled>{__('Disconnect')}</Button>
            </Button.Group>

            <Icon.Pencil size={80}/>
            <h3>Are you sure you want to disconnect from Assistant Cloud?</h3>
            <LogoutButton/>
        </Page>
    )
};
