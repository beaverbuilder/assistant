import React from 'react'
import { Button } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import cloud from 'assistant/cloud'

export default () => {
	const { cloudConfig } = getSystemConfig()
	const cloudUser = cloud.session.getUser()
	return (
		<>
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
