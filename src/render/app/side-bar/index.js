import React from 'react'
import { __ } from '@wordpress/i18n'
import classname from 'classnames'
import { useLocation, useHistory } from 'react-router-dom'
import { Button, Icon, Env, List } from 'assistant/ui'
import {
	useAppList,
	useSystemState,
	getSystemActions,
	getSystemSelectors,
} from 'assistant/data'
import { useMedia } from 'assistant/utils/react'
import './style.scss'

const Sidebar = ( { edge = 'right' } ) => {
	const { window, isAppHidden  } = useSystemState()
	const { selectApp } = getSystemSelectors()
	const { isMobile, isCompactHeight, application } = Env.useEnvironment()
	const {
		toggleIsShowingUI,
		setWindow,
		setIsAppHidden,
		resetAppOrder,
	} = getSystemActions()
	const isVeryCompactHeight = useMedia( { maxHeight: 400 } )


	const getMaxCount = () => {
		if ( isVeryCompactHeight ) {
			return 3
		}
		if ( isCompactHeight ) {
			return 4
		}
		return isMobile ? 3 : 5
	}
	const apps = useAppList( { maxCount: getMaxCount } )
	const { pathname } = useLocation()
	const history = useHistory()

	const isBeaverBuilder = 'beaver-builder' === application
	const isRoot = 0 === history.index
	const isManage = pathname.startsWith( '/fl-manage' )
	const toggleIsAppHidden = () => setIsAppHidden( ! isAppHidden )

	let edgeProp = 'left' === edge ? 'borderRight' : 'borderLeft'
	if ( isMobile ) {
		edgeProp = 'borderTop'
	}

	const toggleWindowSize = () => {
		const sizes = [ 'mini', 'normal' ]
		const current = sizes.indexOf( window.size )
		const next = ( current + 1 ) % sizes.length

		setWindow( { ...window, size: sizes[next] } )
	}

	const goToRoot = () => {
		history.go( -history.length )
		history.replace( '/', {} )
	}
	const navOrHideApp = ( isCurrentScreen = false, goToScreen = () => {} ) => {
		if ( isCurrentScreen ) {
			toggleIsAppHidden()
		} else {
			setIsAppHidden( false )
			goToScreen()
		}
	}

	const classes = classname( 'fl-asst-sidebar', {
		'fl-asst-sidebar-compact': isCompactHeight
	} )

	const manage = selectApp( 'fl-manage' )

	return (
		<div className={ classes }
			style={ {
				[`${edgeProp}`]: isAppHidden ? '' : '2px solid var(--fluid-line-color)' }
			}
		>
			{ ! isBeaverBuilder && (
				<div className="fl-asst-sidebar-cell fl-asst-sidebar-cell-top">
					<Button
						appearance="transparent"
						onClick={ () => toggleIsShowingUI( false ) }
						className="fl-asst-sidebar-close-button"
						title={ __( 'Hide Panel' ) }
					>
						<Icon.Close />
					</Button>
				</div>
			)}


			<div
				className="fl-asst-sidebar-cell fl-asst-sidebar-cell-middle"
			>
				<Button
					appearance={ ( isRoot && ! isAppHidden ) ? 'normal' : 'transparent' }
					status={ ( isRoot && ! isAppHidden ) ? 'primary' : '' }
					title={ __( 'Home' ) }
					onClick={ () => navOrHideApp( isRoot, goToRoot ) }
				>
					<Icon.Home />
				</Button>

				<List.Sortable
					items={apps}
					setItems={ items => {
						const keys = items.map( item => item.handle )
						resetAppOrder( keys )
					}}
				>
				{ app => {
					const { label, handle, icon } = app

					const location = {
						pathname: `/${handle}`,
						state: app,
					}
					const isSelected = pathname.startsWith( `/${handle}` )
					return (
						<Button
							appearance={ ( isSelected && ! isAppHidden ) ? 'normal' : 'transparent' }
							isSelected={ isSelected }
							onClick={ e => {
								navOrHideApp( isSelected, () => history.push( location ) )
							} }
							title={ label }
						>{ icon( { context: 'sidebar', isSelected } ) }</Button>
					)
				}}
				</List.Sortable>

				{ /* apps.map( ( app, i ) => {
					const { label, handle, icon } = app

					const location = {
						pathname: `/${handle}`,
						state: app,
					}
					const isSelected = pathname.startsWith( `/${handle}` )
					return (
						<Button
							key={ i }
							appearance={ ( isSelected && ! isAppHidden ) ? 'normal' : 'transparent' }
							isSelected={ isSelected }
							onClick={ () => navOrHideApp( isSelected, () => history.push( location ) ) }
							title={ label }
						>{ icon( { context: 'sidebar', isSelected } ) }</Button>
					)
				} ) */}

				{ manage && (
					<Button
						appearance={ ( isManage && ! isAppHidden ) ? 'normal' : 'transparent' }
						status={ ( isManage && ! isAppHidden ) ? 'primary' : '' }
						onClick={ () => navOrHideApp( isManage, () => history.push({
							pathname: `/${manage.handle}`,
							state: manage
						}) ) }
						title={ __( 'Manage Apps' ) }
					>
						<Icon.Apps />
					</Button>
				)}
			</div>

			{ ! isBeaverBuilder && ! isMobile && (
				<div className="fl-asst-sidebar-cell">
					<Button
						appearance="transparent"
						onClick={ toggleWindowSize }
						title={ 'mini' === window.size ? __( 'Expand Panel' ) : __( 'Collapse Panel' ) }
					>
						{ 'mini' === window.size ? <Icon.Expand /> : <Icon.Collapse /> }
					</Button>
				</div>
			)}
		</div>
	)
}

export default Sidebar
