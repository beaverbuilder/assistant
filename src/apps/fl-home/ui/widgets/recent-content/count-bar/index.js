import React, { useState } from 'react'
import classname from 'classnames'
import { motion } from 'framer-motion'
import { useSystemState, getSystemConfig } from 'assistant/data'
import './style.scss'

const CountBar = ( { onItemClick = () => {} } ) => {
	const [ isHovering, setIsHovering ] = useState( false )
	const { counts } = useSystemState()
	const { contentTypes } = getSystemConfig()

	return (
		<motion.div
			className="fl-asst-count-bar"
			onHoverStart={ () => setIsHovering( true ) }
			onHoverEnd={ () => setIsHovering( false ) }
			initial={ false }
		>
			{ Object.entries( contentTypes ).map( ( [ handle, type ] ) => {
				const count = counts[`content/${handle}`]
				return (
					<motion.button
						key={ handle }
						className={ classname( 'fluid-button', 'fl-asst-count-bar-item' ) }
						style={ {
							flexGrow: isHovering ? 1 : count
						} }
						positionTransition
						onClick={ () => onItemClick( handle ) }
					>
						{ isHovering && <span>{type.labels.singular} - {count}</span> }
					</motion.button>
				)
			} )}
		</motion.div>
	)
}

export default CountBar
