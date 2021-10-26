import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Menu } from 'assistant/ui'
import { getSystemConfig, useSystemState } from 'assistant/data'
import cloud from 'assistant/cloud'

export default () => {
	const { cloudConfig } = getSystemConfig()
	const { cloudUser } = useSystemState()
	const [ isShowing, setIsShowing ] = useState( false )

	const MenuContent = () => {
		return (
			<>
				<Menu.Item href={ cloudConfig.appUrl } target='_blank'>
					{ __( 'Launch Cloud' ) }
				</Menu.Item>
				<Menu.Item onClick={ () => cloud.auth.logout() }>
					{ __( 'Disconnect' ) }
				</Menu.Item>
			</>
		)
	}

	return (
		<Menu
			content={ <MenuContent /> }
			isShowing={ isShowing }
			onOutsideClick={ () => setIsShowing( false ) }
			style={ { zIndex: 9 } }
		>
			<Button
				onClick={ () => setIsShowing( ! isShowing ) }
				className='fl-asst-cloud-gravatar-link'
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
		</Menu>
	)
}
