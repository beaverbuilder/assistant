import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Layout  } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import cloud from 'assistant/cloud'

export default () => {
	const { cloudConfig } = getSystemConfig()
	const cloudUser = cloud.session.getUser()
	return (
		<>
			<Button
				title={ __( 'Logout' ) }
				onClick={ cloud.auth.logout }
				appearance='transparent'
				size='sm'
				style={ {
					height: '25px',
					width: '25px',
					marginRight: 'var(--fluid-med-space)',
					borderRadius: '100%',
					minHeight: '0',
					minWidth: '0'
				} }
			>
				<span
					className="dashicons dashicons-lock"
				></span>
			</Button>
			<Button
				className='fl-asst-cloud-gravatar-link'
				href={ cloudConfig.appUrl }
				target='_blank'
				appearance='elevator'
				size='sm'
				style={ {
					backgroundImage: `url(${ cloudUser.gravatar.sm })`,
					backgroundSize: 'contain',
					height: '25px',
					width: '25px',
					minHeight: '0',
					minWidth: '0'
				} }
			/>
		</>
	)
}
