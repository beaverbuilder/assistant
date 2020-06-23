import React from 'react'
import { getSystemHistory } from 'assistant/data'
import { Button } from 'assistant/ui'

const TestUI = () => {
	return (
		<div
			className="fl-asst fluid fl uid"
			style={ {
				background: 'white',
				position: 'fixed',
				left: 0,
				bottom: 0,
				width: 300,
				padding: 20,
				border: '1px solid #ccc'
			} }
		>
			<Button
				onClick={ () => {
					const history = getSystemHistory()
					history.push( '/fl-manage' )
				} }
			>Manage</Button>
		</div>
	)
}

export default TestUI
