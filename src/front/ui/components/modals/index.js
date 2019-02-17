import React, { useState, useContext, useEffect } from 'react'
import classname from 'classnames'
import posed from 'react-pose'
import { Stack, Button, Icon, Separator, Toolbar, UIContext } from 'components'
import './style.scss'

export const useModals = () => {
	const [ modals, setModals ] = useState( [] )

	// Render all the current modals - This gets called inside <UI />
	const renderModals = () => {
		return modals.map( ( modal ) => {
			const { type, children, key, pose, initialPose, config } = modal

			switch ( type ) {
			case 'notification':
				return (
					<Notification
						key={key}
						modalID={key}
						pose={pose}
						initialPose={initialPose}
						onPoseComplete={onModalComplete}
						appearance={config.appearance}
						expiry={config.expiry}
						onClick={ 'function' === typeof config.onClick ? config.onClick : null }
					>
						{children}
					</Notification>
				)
			case 'menu':
				return (
					<MenuModal
						key={key}
						modalID={key}
						pose={pose}
						initialPose={initialPose}
						onPoseComplete={onModalComplete}
						onDismiss={config.onDismiss}
					>{children}</MenuModal>
				)
			default:
				return (
					<Modal
						key={key}
						modalID={key}
						pose={pose}
						initialPose={initialPose}
						onPoseComplete={onModalComplete}
						config={config}
					>{children}</Modal>
				)
			}
		} )
	}

	const presentModal = ( children, config = {} ) => {
		const { appearance, id } = config
		const modal = {
			type: 'undefined' !== typeof appearance ? appearance : 'modal',
			key: 'undefined' !== typeof id ? id : Date.now(),
			initialPose: 'offscreen',
			pose: 'onscreen',
			children,
			config,
		}

		const idExists = modalExists( id )

		if ( 'undefined' !== typeof id && idExists ) {
			modals[idExists] = modal
		} else {
			modals.push( modal )
		}
		setModals( Array.from( modals ) )
	}

	const presentNotification = ( message = '', config = {} ) => {
		const { id } = config
		modals.push( {
			type: 'notification',
			key: 'undefined' !== typeof id ? id : Date.now(),
			initialPose: 'offscreen',
			pose: 'onscreen',
			children: message,
			config: Object.assign( { expiry: 3000, appearance: null }, config ),
		} )
		setModals( Array.from( modals ) )
	}

	const dismissModal = ( id ) => {
		if ( 'undefined' !== typeof id ) {
			modals.map( ( modal, i ) => {

				if ( modal.key === id ) {
					modals[i].pose = 'offscreen'
				}
				return modal
			} )
		} else {
			modals[ modals.length - 1 ].pose = 'offscreen'
		}
		setModals( Array.from( modals ) )
	}

	const modalExists = id => {
		let exists = false

		modals.map( modal => {
			if ( modal.key === id ) {
				exists = modal.key
			}
		} )
		return exists
	}

	const onModalComplete = ( pose, modalID ) => {
		if ( 'offscreen' === pose ) {
			modals.map( ( modal, i ) => {
				if ( modal.key === modalID ) {
					modals.splice( i, 1 )
				}
			} )
			setModals( Array.from( modals ) )
		}
	}

	return {
		renderModals,
		presentModal,
		dismissModal,
		modalExists,
		presentNotification,
	}
}

export const Modal = ( { children, pose, initialPose, onPoseComplete, modalID, config } ) => {
	const { dismissModal } = useContext( UIContext )

	const complete = pose => {
		onPoseComplete( pose, modalID )
	}

	const styles = {}
	if ( false === config.coverToolbar ) {
		styles.top = 47
	}

	return (
		<ModalBox className="fl-asst-modal-screen" pose={pose} initialPose={initialPose} onPoseComplete={complete} style={styles}>
			<Toolbar>
				<div className="fl-asst-toolbar-spacer" />
				<Button onClick={ () => dismissModal( modalID )} appearance="icon">
					<Icon name="close" />
				</Button>
			</Toolbar>
			<Separator isSlim={true} />
			<div className="fl-asst-modal-contents">
				<Stack>
					{children}
				</Stack>
			</div>
		</ModalBox>
	)
}

const transition = () => {
	return {
		type: 'tween',
		duration: 220
	}
}

const ModalBox = posed.div( {
	onscreen: {
		opacity: 1,
		scale: 1,
		applyAtEnd: {
			pointerEvents: 'auto',
		},
		transition,
	},
	offscreen: {
		opacity: 0,
		scale: .9,
		applyAtStart: {
			pointerEvents: 'none'
		},
		transition,
	}
} )
ModalBox.displayName = 'ModalBox'


const Notification = ( { children, pose, initialPose, onPoseComplete, appearance, modalID, expiry, onClick } ) => {
	const { dismissModal } = useContext( UIContext )
	const classes = classname( {
		'fl-asst-notification': true,
		'fl-asst-notification-warning': 'warning' === appearance,
		'fl-asst-notification-error': 'error' === appearance,
	} )

	useEffect( () => {
		if ( expiry ) {
			const timer = setTimeout( () => {
				dismissModal( modalID )
			}, expiry )

			return () => clearTimeout( timer )
		}
	}, [] )

	const complete = pose => {
		onPoseComplete( pose, modalID )
	}

	const dismiss = e => {
		dismissModal( modalID )
		e.stopPropagation()
	}

	let mainClick = null
	if ( 'function' === typeof onClick ) {
		mainClick = e => {
			const dismiss = () => {
				dismissModal( modalID )
			}
			onClick( dismiss, modalID, e )
		}
	}

	return (
		<div className="fl-asst-modal-screen fl-asst-modal-notification-screen">
			<NotificationBox className={classes} pose={pose} initialPose={initialPose} onPoseComplete={complete}>
				<Button onClick={mainClick} className="fl-asst-notification-message" appearance="transparent">{children}</Button>
				<Button onClick={dismiss} appearance="icon">
					<Icon name="close" />
				</Button>
			</NotificationBox>
		</div>
	)
}

const notificationTransition = () => {
	return {
		type: 'tween',
		duration: 150
	}
}

const NotificationBox = posed.div( {
	onscreen: {
		y: '0%',
		transition: notificationTransition,
	},
	offscreen: {
		y: '-100%',
		transition: notificationTransition,
	},
} )


const menuBoxTransition = () => {
	return {
		type: 'spring',
		mass: .2
	}
}

const OverlayBox = posed.div( {
	onscreen: {
		opacity: 1,
		transition: menuBoxTransition,
	},
	offscreen: {
		opacity: 0,
		transition: menuBoxTransition,
	}
} )

const MenuBox = posed.div( {
	init: {
		transformOrigin: 'top',
	},
	onscreen: {
		scale: 1,
		opacity: 1,
		transition: menuBoxTransition,
	},
	offscreen: {
		scale: .9,
		opacity: 0,
		transition: menuBoxTransition,
	},
} )

const MenuModal = ( { children, modalID, pose, initialPose, onPoseComplete, onDismiss } ) => {
	const { dismissModal } = useContext( UIContext )

	const dismiss = () => {
		dismissModal( modalID )
		if ( 'undefined' !== typeof onDismiss ) {
			onDismiss()
		}
	}

	const complete = pose => {
		onPoseComplete( pose, modalID )
	}

	const preventPropagation = e => e.stopPropagation()

	return (
		<OverlayBox
			className="fl-asst-modal-screen fl-asst-screen-menu-frame"
			onClick={dismiss}
			pose={pose}
			initialPose={initialPose}
			onPoseComplete={complete}
		>
			<MenuBox
				className="fl-asst-screen-menu-contents"
				initialPose={initialPose}
				onClick={preventPropagation}
			>
				<Stack>
					{children}
				</Stack>
			</MenuBox>
		</OverlayBox>
	)
}
