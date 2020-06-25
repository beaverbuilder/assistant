import React from 'react'
import { useHistory } from 'react-router-dom'
import { Icon } from '../'
import TooltipButton from './tooltip-button'
import './style.scss'

const Button = TooltipButton
Button.displayName = 'Button'

Button.Back = props => {
	const history = useHistory()
	return (
		<Button
			className="fluid-back-button"
			appearance="transparent"
			onClick={ history.goBack }
			{ ...props }
		>
			<Icon.BackArrow />
		</Button>
	)
}

export default Button
