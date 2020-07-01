import React from 'react'
import { useHistory } from 'react-router-dom'
import * as Icon from '../icon'
import TooltipButton from './tooltip-button'
import Group from './group'
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

Button.Group = Group

export default Button
