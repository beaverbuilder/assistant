import React, { useContext } from 'react'
import { useDispatch } from 'store'
import { Button, ScreenHeader, StackContext, AppContext, UIContext } from 'components'

const { registerApp } = useDispatch()

const DetailScreen = () => {
    const context = useContext( StackContext )
    return (
        <div>
            <ScreenHeader title="Detail Screen" />
            <Button onClick={ () => {} }>Pop View</Button>
        </div>
    )
}

const MainScreen = () => {
    const ui = useContext( UIContext )
    const app = useContext( AppContext )
    const stack = useContext( StackContext )
    console.log('fl-testing', { ui, app, stack })
    return (
        <div>
            <ScreenHeader />

            <Button onClick={ () => {} }>Push View</Button>
        </div>
    )
}

registerApp( 'fl-testing', {
	label: 'Test',
	content: props => <MainScreen {...props} />,
} )
