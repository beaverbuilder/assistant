import React, { useState, memo } from 'react'
import { __ } from '@wordpress/i18n'
import classname from 'classnames'
import { useHistory } from 'react-router-dom'
import { motion } from 'framer-motion'
import { App, Button, Icon, Env, List } from 'assistant/ui'
import {
	useSystemState,
	getSystemActions,
	getSystemSelectors,
	useTestState,
	getTestActions,
} from 'assistant/data'
import { useMedia } from 'utils/react'
import useAppOrder from './use-app-order'
import './style.scss'

const Sidebar = memo( () => {
	const { window, isAppHidden  } = useSystemState()
	const { selectApp, selectHomeApp } = getSystemSelectors()
	const {
		isMobile,
		isCompactHeight,
		application
	} = Env.use()

	const {
		toggleIsShowingUI,
		setWindow,
		setIsAppHidden,
	} = getSystemActions()

	const [ isSorting, setIsSorting ] = useState( false )
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

	const history = useHistory()
	const { pathname } = history.location

	const isBeaverBuilder = 'beaver-builder' === application
	const isRoot = 0 === history.index
	const isManage = pathname.startsWith( '/fl-manage' )
	const toggleIsAppHidden = () => setIsAppHidden( ! isAppHidden )

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
		'fl-asst-sidebar-compact': isCompactHeight,
		'is-sorting': isSorting,
	} )

	const home = selectHomeApp()
	const manage = selectApp( 'fl-manage' )

	return (
		<div className={ classes }>
			{ ! isBeaverBuilder && (
				<div className="fl-asst-sidebar-cell fl-asst-sidebar-cell-top disable-while-sorting">
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

				<App.List>
					{ ( { label, handle, icon } ) => {

						const location = {
							pathname: `/${handle}`
						}
						const isSelected = handle === pathname.split( '/' )[1]

						const iconProps = {
							icon,
							context: 'sidebar',
							isSelected
						}
						return (
							<Button
								appearance={ ( isSelected && ! isAppHidden ) ? 'normal' : 'transparent' }
								shape="round"
								size="lg"
								isSelected={ isSelected }
								onClick={ () => {
									navOrHideApp( isSelected, () => history.push( location ) )
								} }
								title={ label }
							>
								<AppIcon { ...iconProps } />
							</Button>
						)
					}}
				</App.List>

				{ /*false && home && (
					<motion.div
						tag={ motion.a }
						layout
						transition={ { layoutX: { duration: 0 } } }
					>
						<Button
							appearance={ ( isRoot && ! isAppHidden ) ? 'normal' : 'transparent' }
							shape="round"
							size="lg"
							isSelected={ isRoot && ! isAppHidden }
							onClick={ () => navOrHideApp( isRoot, goToRoot ) }
							className="disable-while-sorting"
							title={ home.label }
						>
							<Icon.Safely icon={ home.icon } isSelected={ isRoot && ! isAppHidden }  />
						</Button>
					</motion.div>
				) */}

				{ /* <List.Sortable
					items={ appOrder }
					setItems={ setAppOrder }
					keyProp={ item => item }
					onSortStart={ () => setIsSorting( true ) }
					onSortEnd={ () => setIsSorting( false ) }
				>
					{ key => {
						const app = selectApp( key )
						const { handle, icon, label } = app

						const location = {
							pathname: `/${handle}`,
							state: app,
						}
						const isSelected = handle === pathname.split( '/' )[1]

						const iconProps = {
							icon,
							context: 'sidebar',
							isSelected
						}

						return (
							<Button
								appearance={ ( isSelected && ! isAppHidden ) ? 'normal' : 'transparent' }
								shape="round"
								size="lg"
								isSelected={ isSelected }
								onClick={ () => {
									navOrHideApp( isSelected, () => history.push( location ) )
								} }
								title={ label }
							>
								<AppIcon { ...iconProps } />
							</Button>
						)
					}}
				</List.Sortable> */ }

				{ /* manage && (
					<motion.div
						tag={ motion.a }
						layout
						transition={ { layoutX: { duration: 0 } } }
					>
						<Button
							appearance={ ( isManage && ! isAppHidden ) ? 'normal' : 'transparent' }
							shape="round"
							size="lg"
							isSelected={ isManage && ! isAppHidden }
							onClick={ () => navOrHideApp( isManage, () => history.push( {
								pathname: `/${manage.handle}`,
								state: manage
							} ) ) }
							className="disable-while-sorting"
							title={ manage.label }
						>
							<Icon.Safely icon={ manage.icon } isSelected={ isManage && ! isAppHidden } />
						</Button>
					</motion.div>
				) */}
			</div>

			{ ! isBeaverBuilder && ! isMobile && (
				<div className="fl-asst-sidebar-cell disable-while-sorting">
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
} )

const AppIcon = memo(  ( { icon, ...rest } ) => <Icon.Safely icon={ icon } { ...rest } /> )

export default Sidebar
