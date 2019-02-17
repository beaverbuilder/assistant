import React, { Fragment } from 'react'
import { useSpring, animated } from 'react-spring'
import { useDispatch } from 'store'
import { Padding, Button } from 'components'
import { useAppFrame } from 'system'
import './style.scss'

const { registerApp } = useDispatch()

const shuffleArray = array => {
	let currentIndex = array.length
	let temporaryValue
	let randomIndex = 0

	// While there remain elements to shuffle...
	while ( 0 !== currentIndex ) {

		// Pick a remaining element...
		randomIndex = Math.floor( Math.random() * currentIndex )
		currentIndex -= 1

		// And swap it with the current element.
		temporaryValue = array[currentIndex]
		array[currentIndex] = array[randomIndex]
		array[randomIndex] = temporaryValue
	}
	return array
}

const Box = animated.div

const TestingApp = () => {
	const { setAppFrameSize } = useAppFrame()

	const styles = useSpring({
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
	})

	return (
		<Fragment>
			<Padding>
				<Box style={styles}>
					I am an animated box.
				</Box>
			</Padding>

			<Button onClick={ () => setAppFrameSize('wide') }>Go Wide</Button>
		</Fragment>
	)
}


registerApp( 'fl-testing', {
	label: 'Testing Lists',
	content: () => <TestingApp />,
} )
