import { __ } from '@wordpress/i18n'
import React, { useContext } from 'fl-react'
import { App, Page, Nav, List } from 'assistant/lib'

export const Invite = () => {
    return (
        <Page shouldPadSides={true}>
        <h2>{ __('Invite Users') }</h2>
        </Page>
    )
}
