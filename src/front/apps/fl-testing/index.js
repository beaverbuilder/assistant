import React from 'react'
import { getDispatch } from 'store'
import { Padding } from 'components'
import './style.scss'

const { registerApp } = getDispatch()

const TestingApp = () => {
	return (
		<Padding>
			Nothing to see here.
		</Padding>
	)
}


registerApp( 'fl-testing', {
	label: 'Testing Lists',
	content: () => <TestingApp />,
} )
