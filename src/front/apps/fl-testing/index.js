import React, { Fragment } from 'react'
import { useDispatch } from 'store'
import { Padding, Button, SortableList } from 'components'
import { useAppFrame } from 'system'
import './style.scss'

const { registerApp } = useDispatch()

const TestingApp = () => {
	const { setAppFrameSize } = useAppFrame()

	return (
		<Fragment>
			<Padding>

				<SortableList>
					<div className="inner-item">Item 1</div>
					<div className="inner-item">Item 2</div>
					<div className="inner-item">Item 3</div>
					<div className="inner-item">Item 4</div>
				</SortableList>

				<Button onClick={ () => setAppFrameSize( 'wide' ) }>Go Wide</Button>
			</Padding>
		</Fragment>
	)
}


registerApp( 'fl-testing', {
	label: 'Testing Lists',
	content: () => <TestingApp />,
} )
