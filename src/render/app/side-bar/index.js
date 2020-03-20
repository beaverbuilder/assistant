import React, { useContext } from 'react'
import { __ } from '@wordpress/i18n'
import { useLocation, useHistory } from 'react-router-dom'
import { App, Button, Icon } from 'assistant/ui'
import { useAppList, useSystemState, getSystemActions } from 'assistant/data'
import './style.scss'

const Sidebar = ( { edge = 'right' } ) => {
	const { window, isAppHidden  } = useSystemState()
	const { environment } = useContext( App.Context )
	const {
		toggleIsShowingUI,
		setWindow,
		setIsAppHidden
	} = getSystemActions()
	const _apps = useAppList( { maxCount: 5 } )
	const { pathname } = useLocation()
	const history = useHistory()

	const isBeaverBuilder = 'beaver-builder' === environment
	const isRoot = 0 === history.index
	const isManage = pathname.startsWith( '/fl-manage' )
	const toggleIsAppHidden = () => setIsAppHidden( ! isAppHidden )

	const edgeProp = 'left' === edge ? 'borderRight' : 'borderLeft'

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

	return (
		<div
			className="fl-asst-sidebar"
			style={ {
				flexGrow: 0,
				flexShrink: 0,
				flexBasis: isAppHidden ? 58 : 60, /* account for border */
				display: 'flex',
				flexDirection: 'column',
				[`${edgeProp}`]: isAppHidden ? '' : '2px solid var(--fluid-box-background)' }
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
				style={ { flex: '0 0 auto', margin: 'auto 0' } }
			>
				<Button
					appearance={ ( isRoot && ! isAppHidden ) ? 'normal' : 'transparent' }
					status={ ( isRoot && ! isAppHidden ) ? 'primary' : '' }
					title={ __( 'Home' ) }
					onClick={ () => navOrHideApp( isRoot, goToRoot ) }
				>
					<Icon.Home />
				</Button>

				{ _apps.map( ( app, i ) => {
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
							status={ ( isSelected && ! isAppHidden ) ? 'primary' : 'normal' }
							onClick={ () => navOrHideApp( isSelected, () => history.push( location ) ) }
							title={ label }
						>{ icon( { context: 'sidebar' } ) }</Button>
					)
				} )}

				<Button
					appearance={ ( isManage && ! isAppHidden ) ? 'normal' : 'transparent' }
					status={ ( isManage && ! isAppHidden ) ? 'primary' : '' }
					onClick={ () => navOrHideApp( isManage, () => history.push( '/fl-manage' ) ) }
					title={ __( 'Manage Apps' ) }
				>
					<Icon.Apps />
				</Button>
			</div>

			{ ! isBeaverBuilder && (
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
