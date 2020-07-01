import React from 'react'
import { useHistory } from 'react-router-dom'
import * as Icon from '../../icon'
import Button from '../../button'

const BackButton = props => {
	const history = useHistory()
	return (
		<Button
			className="fluid-back-button"
			onClick={ history.goBack }
			{ ...props }
		>
			<Icon.BackArrow />
		</Button>
	)
}

export default BackButton
