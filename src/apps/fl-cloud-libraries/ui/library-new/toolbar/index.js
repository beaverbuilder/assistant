import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Layout, Menu } from 'assistant/ui'

export default ( { library } ) => {
	const history = useHistory()
	const { pathname } = useLocation()
	const basePath = `/fl-cloud-libraries/${ library.id }`

	return (
		<Layout.Toolbar>
			<div>{ __( 'View By:' ) }</div>
			<Button
				appearance={ pathname === basePath ? '' : 'transparent' }
				onClick={ () => history.replace( basePath ) }
			>
				{ __( 'Type' ) }
			</Button>
			<Button
				appearance={ pathname.includes( '/collections' ) ? '' : 'transparent' }
				onClick={ () => history.replace( `${ basePath }/collections` ) }
			>
				{ __( 'Collection' ) }
			</Button>
			{ library.permissions.update &&
				<>
					<AddNewMenu library={ library } />
					<Button
						size='sm'
						appearance={ pathname.includes( '/settings' ) ? '' : 'transparent' }
						onClick={ () => history.replace( `${ basePath }/settings` ) }
					>
						<Icon.Cog />
					</Button>
				</>
			}
		</Layout.Toolbar>
	)
}

const AddNewMenu = ( { library } ) => {
	const [ isMenuShowing, setIsMenuShowing ] = useState( false )
	const history = useHistory()
	const basePath = `/fl-cloud-libraries/${ library.id }/add`

	const goto = ( route ) => {
		setIsMenuShowing( false )
		history.replace( route )
	}

	const MenuContent = () => {
		return (
			<>
				<Menu.Item onClick={ () => goto( `${ basePath }/posts` ) }>
					{ __( 'Posts' ) }
				</Menu.Item>
				<Menu.Item onClick={ () => goto( `${ basePath }/images` ) }>
					{ __( 'Images' ) }
				</Menu.Item>
				<Menu.Item onClick={ () => goto( `${ basePath }/svg` ) }>
					{ __( 'SVG' ) }
				</Menu.Item>
				<Menu.Item onClick={ () => goto( `${ basePath }/colors` ) }>
					{ __( 'Colors' ) }
				</Menu.Item>
			</>
		)
	}

	return (
		<Menu
			content={ <MenuContent /> }
			isShowing={ isMenuShowing }
			onOutsideClick={ () => setIsMenuShowing( false ) }
		>
			<Button
				size='sm'
				appearance='transparent'
				onClick={ () => setIsMenuShowing( ! isMenuShowing ) }
				style={ {
					marginLeft: 'auto'
				} }
			>
				<Icon.Plus />
			</Button>
		</Menu>
	)
}
