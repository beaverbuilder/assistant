import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Layout, Text } from 'assistant/ui'
import AppList from './app-list'
import './style.scss'

const AppsWidget = () => {
	return (
		<>
			<Layout.Toolbar>
				<Text.Title>{ __( 'Apps' ) }</Text.Title>
				<Button
					appearance="transparent"
					status="primary"
					to='/fl-manage'
					style={ { marginLeft: 'auto' } }
				>{__( 'Manage' )}</Button>
			</Layout.Toolbar>
			<AppList />
		</>
	)
}

export default AppsWidget
