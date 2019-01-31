import React, { useContext } from 'react'
import { useDispatch } from 'store'
import { Button, ScreenHeader, StackContext } from 'components'

const { registerApp } = useDispatch()

const DetailScreen = () => {
	const { popView } = useContext( StackContext )
	return (
		<div>
			<ScreenHeader title="Detail Screen" />
			<Button onClick={popView}>Pop View</Button>
		</div>
	)
}

const MainScreen = () => {
	const { pushView } = useContext( StackContext )
	return (
		<div>
			<ScreenHeader />
			<Button onClick={ () => pushView( <DetailScreen /> ) }>Push View</Button>
		</div>
	)
}

registerApp( 'fl-testing', {
	label: 'Testing Screen',
	content: props => <MainScreen {...props} />,
} )
