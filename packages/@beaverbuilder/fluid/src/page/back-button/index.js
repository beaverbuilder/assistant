import React from 'react'
import { useHistory } from 'react-router-dom'
import { BackArrow } from '@beaverbuilder/icons'
import Button from '../../button'

const BackButton = props => {
	const history = useHistory()
	return (
		<Button
			className="fluid-back-button"
			appearance="transparent"
			onClick={ history.goBack }
			{ ...props }
		>
			<BackArrow />
		</Button>
	)
}

export default BackButton
