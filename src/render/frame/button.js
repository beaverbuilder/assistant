import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useSystemState, getSystemActions } from 'assistant/data'
import { Icon } from 'assistant/ui'
import { useEdgeInsets, getLeft, getOrigin, originHasChanged } from './utils'

const FloatingButton = ( { ...rest } ) => {
	const animation = useAnimation()
	const { window: windowFrame } = useSystemState( [ 'window' ] )
	const { origin } = windowFrame
	const { toggleIsShowingUI, setWindow } = getSystemActions()

	const [ dragArea, setDragArea ] = useState( false )

	const size = 50
	const insets = useEdgeInsets( 15 )

	const getTop = ( originY, size, insets ) => {

		//return originY ? `calc( 100vh - ${ size + insets.bottom } )` : insets.top
		return insets.top
	}

	// Handle origin change.
	useEffect( () => {
		animation.start( {
			x: 0,
			y: 0,
			top: getTop( origin[1], size, insets ),
			left: getLeft( origin[0], size, insets ),
		} )
	}, [ origin ] )

	return (
		<>
			<motion.button
				onClick={ () => {
					if ( ! dragArea ) {
						toggleIsShowingUI()
					}
					setDragArea( false )
				} }
				initial={ {
					position: 'fixed',
					top: getTop( origin[1], size, insets ),
					left: getLeft( origin[0], size, insets ),
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: 'var(--fluid-opaque-13)',
					width: size,
					height: size,
					borderRadius: size / 2,
					scale: 1,
					zIndex: 99999
				} }
				animate={ animation }
				transition={ { type: 'tween' } }

				drag
				whileDrag={ { scale: 1.1 } }
				onDrag={ ( e, info ) => {
					const newOrigin = getOrigin( info.point )
					if ( originHasChanged( dragArea, newOrigin ) ) {
						setDragArea( origin )
					}
				} }
				onDragEnd={ ( e, info ) => {
					const newOrigin = getOrigin( info.point )

					if ( originHasChanged( origin, newOrigin ) ) {
						setWindow( { ...windowFrame, origin: newOrigin } )
					} else {

						// Back to your corner
						animation.start( { x: 0, y: 0 } )
					}
				} }
				{ ...rest }
			>
				<Icon.Pencil size={ 36 } />
			</motion.button>
		</>
	)
}

export default FloatingButton
