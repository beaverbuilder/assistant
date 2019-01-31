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

registerApp( 'fl-testing', {
	label: 'Test',
	content: props => {
        const ui = useContext( UIContext )
        const app = useContext( AppContext )
        const stack = useContext( StackContext )
		return (
			<div>
                <ScreenHeader />

                <Button onClick={ () => {} }>Push View</Button>
			</div>
		)
	},
} )
