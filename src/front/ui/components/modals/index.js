import React, { Fragment, useState, useContext, useEffect } from 'react'
import posed from 'react-pose'
import { Stack, Button, Icon, Separator, Toolbar, UIContext } from 'components'
import './style.scss'

export const useModals = () => {
    const [modals, setModals] = useState([])
    const [ action, setAction ] = useState()

    const renderModals = () => {
        return modals.map( ( modal, i ) => {
            const { children, key, pose } = modal
            return (
                <Modal key={key} pose={pose} onPoseComplete={onModalComplete}>{children}</Modal>
            )
        })
    }

    const presentModal = ( children, config = {} ) => {
        modals.push( {
            key: Date.now(),
            pose: 'offscreen',
            children,
            config,
        } )
        setModals( Array.from( modals ) )
        setAction('present')
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
        setAction('dismiss')
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

export const Modal = ({ children, pose, onPoseComplete }) => {
    const { dismissModal } = useContext( UIContext )
    return (
        <ModalBox className="fl-asst-modal-screen" pose={pose} onPoseComplete={onPoseComplete}>
            <Toolbar>
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

const ModalBox = posed.div({
    onscreen: {
        y: '0%',
        applyAtEnd: {
            pointerEvents: 'auto',
        }
    },
    offscreen: {
        y: '100%',
        applyAtStart: {
            pointerEvents: 'none'
        }
    }
})
ModalBox.displayName = 'ModalBox'
