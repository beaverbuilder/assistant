import React, { memo } from 'react'
import { __ } from '@wordpress/i18n'
import { UP, DOWN } from '@wordpress/keycodes'
import classname from 'classnames'
import { useHistory } from 'react-router-dom'
import { motion } from 'framer-motion'
import { App, Button, Icon, Env } from 'assistant/ui'
import { useSystemState, getSystemActions, getSystemSelectors } from 'assistant/data'
import { useMedia } from 'utils/react'
import './style.scss'

const Sidebar = memo( () => {
	const { isAppHidden } = useSystemState()
	const { selectApp, selectHomeApp } = getSystemSelectors()
	const { isMobile, isCompactHeight, application } = Env.use()
	const { toggleIsShowingUI, setIsAppHidden } = getSystemActions()
	const isVeryCompactHeight = useMedia( { maxHeight: 400 } )
	const history = useHistory()
	const { pathname } = history.location

	const getMaxCount = () => {
		if ( isVeryCompactHeight ) {
			return 3
		}
		if ( isCompactHeight ) {
			return 4
		}
		return isMobile ? 3 : 5
	}

	const isBeaverBuilder = 'beaver-builder' === application
	const isRoot = 0 === history.index
	const isManage = pathname.startsWith( '/fl-manage' )
	const toggleIsAppHidden = () => setIsAppHidden( ! isAppHidden )

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
	} )

	const HomeItem = () => {
		const home = selectHomeApp()

		if ( ! home ) {
			return null
		}

		return (
			<motion.li layout transition={ { layoutX: { duration: 0 } } } >
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
			</motion.li>
		)
	}

	const ManageItem = () => {
		const manage = selectApp( 'fl-manage' )
		return (
			<motion.li layout transition={ { layoutX: { duration: 0 } } } >
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
			</motion.li>
		)
	}

	const ToggleHiddenButton = () => {

		let onClick = () => toggleIsShowingUI( false )
		if ( isBeaverBuilder ) {
			if ( undefined !== FL.Builder && 'function' === typeof FL.Builder.togglePanel ) {
				onClick = FL.Builder.togglePanel
			} else {

				// For older versions of BB, just hide the button.
				return null
			}
		}

		return (
			<Button
				appearance="transparent"
				onClick={ onClick }
				className="fl-asst-sidebar-close-button"
				title={ __( 'Hide Panel' ) }
				shape="round"
				size="lg"
				style={ { margin: '0 auto' } }
			>
				<Icon.Close />
			</Button>
		)
	}

	return (
		<div className={ classes } style={ { cursor: ! isBeaverBuilder && 'move' } } >

			<div className="fl-asst-sidebar-cell fl-asst-sidebar-cell-top">
				<ToggleHiddenButton />
			</div>

			<div className="fl-asst-sidebar-cell fl-asst-sidebar-cell-middle">
				<App.List
					before={ <HomeItem /> }
					after={ <ManageItem /> }
					limit={ getMaxCount() }
				>
					{ ( { label, handle, icon, moveDown, moveUp } ) => {

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
								isSelected={ isSelected && ! isAppHidden }
								onClick={ () => {
									navOrHideApp( isSelected, () => history.push( location ) )
								} }
								title={ label }
								onKeyDown={ e => {
									if ( e.keyCode === DOWN ) {
										moveDown()
										e.preventDefault()
									}
									if ( e.keyCode === UP ) {
										moveUp()
										e.preventDefault()
									}
								} }
							>
								<AppIcon { ...iconProps } />
							</Button>
						)
					}}
				</App.List>
			</div>

			{ /* Just here as a 60px offset right now */ }
			{ ! isMobile && (
				<div
					className="fl-asst-sidebar-cell disable-while-sorting"
					style={ { minHeight: 60 } }
				/>
			) }
		</div>
	)
} )

const AppIcon = memo(  props => <Icon.Safely { ...props } /> )

export default Sidebar
