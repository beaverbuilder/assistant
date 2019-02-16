import React, { Fragment, useContext, useState } from 'react'
import { useDispatch } from 'store'
const { registerApp } = useDispatch()
import './style.scss'

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

const TestingApp = () => {

	return (
		<Fragment>
            test.
		</Fragment>
	)
}


registerApp( 'fl-testing', {
	label: 'Testing Lists',
	content: () => <TestingApp />,
} )
