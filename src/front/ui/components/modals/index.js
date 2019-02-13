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

			if ( 'notification' === type ) {
				return (
					<Notification
						key={key}
						modalID={key}
						pose={pose}
						initialPose={initialPose}
						onPoseComplete={onModalComplete}
						appearance={config.appearance}
						expiry={config.expiry}
					>
						{children}
					</Notification>
				)
			}

			return (
				<Modal
					key={key}
					modalID={key}
					pose={pose}
					initialPose={initialPose}
					onPoseComplete={onModalComplete}
				>{children}</Modal>
			)
		} )
	}

	const presentModal = ( children, config = {} ) => {
		modals.push( {
			type: 'modal',
			key: Date.now(),
			initialPose: 'offscreen',
			pose: 'onscreen',
			children,
			config,
		} )
		setModals( Array.from( modals ) )
	}

	const presentNotification = ( message = '', config = {} ) => {
		modals.push( {
			type: 'notification',
			key: Date.now(),
			initialPose: 'offscreen',
			pose: 'onscreen',
			children: message,
			config: Object.assign( { expiry: 3000, appearance: null }, config ),
		} )
		setModals( Array.from( modals ) )
	}

	const dismissModal = ( id ) => {

		if ( Number.isInteger( id ) ) {

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
		presentNotification,
	}
}

export const Modal = ( { children, pose, initialPose, onPoseComplete, modalID } ) => {
	const { dismissModal } = useContext( UIContext )
	const complete = pose => {
		onPoseComplete( pose, modalID )
	}
	return (
		<ModalBox className="fl-asst-modal-screen" pose={pose} initialPose={initialPose} onPoseComplete={complete}>
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


const Notification = ( { children, pose, initialPose, onPoseComplete, appearance, modalID, expiry } ) => {
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

	return (
		<div className="fl-asst-modal-screen fl-asst-modal-notification-screen">
			<NotificationBox className={classes} pose={pose} initialPose={initialPose} onPoseComplete={complete}>
				<div className="fl-asst-notification-message">{children}</div>
				<Button onClick={() => dismissModal( modalID )} appearance="icon">
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
