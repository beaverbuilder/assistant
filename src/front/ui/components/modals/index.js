import React, { useState, useContext, useEffect } from 'react'
import posed from 'react-pose'
import { Stack, Button, Icon, Separator, Toolbar, UIContext } from 'components'
import './style.scss'

export const useModals = () => {
	const [ modals, setModals ] = useState( [] )
	const [ action, setAction ] = useState()

	const renderModals = () => {
		return modals.map( ( modal ) => {
			const { children, key, pose } = modal
			return (
				<Modal key={key} pose={pose} onPoseComplete={onModalComplete}>{children}</Modal>
			)
		} )
	}

	const presentModal = ( children, config = {} ) => {
		modals.push( {
			key: Date.now(),
			pose: 'offscreen',
			children,
			config,
		} )
		setModals( Array.from( modals ) )
		setAction( 'present' )
	}

	// After DOM is mounted, "present" new model.
	useEffect( () => {
		if ( action ) {
			if ( 'present' === action ) {
				setModals( modals.map( modal => {
					switch ( modal.pose ) {
					case 'offscreen':
						modal.pose = 'onscreen'
						break
					}
					return modal
				} ) )
			}
			setAction( null )
		}
	} )

	const dismissModal = () => {
		modals[ modals.length - 1 ].pose = 'offscreen'
		setModals( Array.from ( modals ) )
		setAction( 'dismiss' )
	}

	const onModalComplete = pose => {
		if ( 'dismiss' === action && 'offscreen' === pose ) {
			modals.pop()
			setModals( Array.from( modals ) )
			setAction( null )
		}
	}

	return {
		renderModals,
		presentModal,
		dismissModal,
	}
}

export const Modal = ( { children, pose, onPoseComplete } ) => {
	const { dismissModal } = useContext( UIContext )
	return (
		<ModalBox className="fl-asst-modal-screen" pose={pose} onPoseComplete={onPoseComplete}>
			<Toolbar>
				<div className="fl-asst-toolbar-spacer" />
				<Button onClick={dismissModal} appearance="icon">
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
