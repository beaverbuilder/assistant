import React from 'react'
import { __ } from '@wordpress/i18n'
import c from 'classnames'
import MediaIcon from '../../icon'
import './style.scss'

const MediaShell = ( { children, className, ...rest } ) => {
	return (
		<div
			className={ c( 'fl-asst-media-app-shell', className ) }
			{ ...rest }
		>
			<div className="fl-asst-media-app-sidebar-backdrop" />
			<div className="fl-asst-toolbar">
				<div className="fl-asst-primary-toolbar-area">
					<div className="fl-asst-media-branding">
						<MediaIcon />
						{ __( 'Media', 'fl-assistant' ) }
					</div>
				</div>
				<div className="fl-asst-secondary-toolbar-area"></div>
			</div>
			<div className="fl-asst-media-app-content">{children}</div>
		</div>
	)
}

export default MediaShell
