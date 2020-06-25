import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Icon } from '../../'

const BackButton = props => {
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

export default BackButton
