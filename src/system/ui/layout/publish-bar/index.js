import React from 'react'
import { Layout } from 'fluid/ui'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
import { Button } from 'ui'
import './style.scss'

const PublishBar = ( {
	className,
	message = __( 'You have unpublished changes' ),
	onPublish = () => {},
	onDiscard = () => {},
	...rest
} ) => {

	const classes = classname( {
		'fl-asst-publish-bar': true,
	}, className )

	return (
		<Layout.Box className={ classes } padX={ false } padY={ false } { ...rest }>
			{ message && <div className="fl-asst-publish-bar-message">{message}</div> }
			<div className="fl-asst-publish-bar-actions">
				<Button
					status="primary"
					onClick={ onPublish }
				>{__( 'Publish' )}</Button>
				<Button
					onClick={ onDiscard }
				>{__( 'Discard Changes' )}</Button>
			</div>
		</Layout.Box>
	)
}

export default PublishBar
