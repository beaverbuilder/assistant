import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button } from 'assistant/ui'
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
					height: '30px',
					width: '30px',
					marginRight: '10px',
					borderRadius: '100%',
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
					height: '30px',
					width: '30px',
				} }
			/>
		</>
	)
}
