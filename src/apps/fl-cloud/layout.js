import React from 'react'
import { __ } from '@wordpress/i18n'
import classname from 'classnames'
import { Page } from 'assistant/ui'
import AppIcon from './icon'
import './style.scss'

export default ( { className, children } ) => {
	const classes = classname( className, {
		'fl-asst-cloud-layout': true,
	} )
	return (
		<Page
			className={ classes }
			title={ __( 'Cloud' ) }
			icon={ <AppIcon context="sidebar" /> }
			shouldShowBackButton={ false }
		>
			{ children }
		</Page>
	)
}
