import React, { Fragment } from 'react'
import { useSpring, animated } from 'react-spring'
import { useDispatch } from 'store'
import { Padding, Button } from 'components'
import { useAppFrame } from 'system'
import './style.scss'

const { registerApp } = useDispatch()

const Box = animated.div

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
				<Box style={styles}>
					I am an animated box.
				</Box>
			</Padding>

			<Button onClick={ () => setAppFrameSize( 'wide' ) }>Go Wide</Button>
		</Fragment>
	)
}


registerApp( 'fl-testing', {
	label: 'Testing Lists',
	content: () => <TestingApp />,
} )
