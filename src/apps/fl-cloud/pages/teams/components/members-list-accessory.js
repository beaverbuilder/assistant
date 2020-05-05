import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Menu } from 'assistant/ui'

export const MembersListAccessory = ( { item } ) => {
	const [ isMenuShowing, setIsMenuShowing ] = useState( false )

	const MenuContent = () => {
		return (
			<>
				{ 'admin' === item.role &&
					<Menu.Item>{ __( 'Change to Member' ) }</Menu.Item>
				}
				{ 'member' === item.role &&
					<Menu.Item>{ __( 'Change to Admin' ) }</Menu.Item>
				}
				{ ! item.invite &&
					<Menu.Item style={ { color: 'var(--fluid-destructive-color)' } }>
						{ __( 'Remove from Team' ) }
					</Menu.Item>
				}
				{ item.invite &&
					<Menu.Item style={ { color: 'var(--fluid-destructive-color)' } }>
						{ __( 'Cancel Invite' ) }
					</Menu.Item>
				}
			</>
		)
	}

	return (
		<Menu
			content={ <MenuContent /> }
			isShowing={ isMenuShowing }
			onOutsideClick={ () => setIsMenuShowing( false ) }
		>
			<Button onClick={ () => setIsMenuShowing( ! isMenuShowing ) }>
				<span
					style={ { marginTop: '-6px' } }
					className="dashicons dashicons-admin-generic"
				></span>
			</Button>
		</Menu>
	)
}
