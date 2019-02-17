import React, { Fragment } from 'react'
import { useSpring, animated } from 'react-spring'
import { useDispatch } from 'store'
import { Padding, Button, SortableList } from 'components'
import { useAppFrame } from 'system'
import './style.scss'

const { registerApp } = useDispatch()

const TestingApp = () => {
	const { setAppFrameSize } = useAppFrame()

	const styles = useSpring( {
		background: 'green',
		color: 'white',
		width: 400,
		height: 300,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 20,

		from: {
			background: 'blue'
		},
	} )

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
