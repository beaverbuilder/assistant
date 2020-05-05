import React, { useEffect, useState } from 'react'
import { Page, App } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'

export default () => {
    return (
        <App.Config
            pages={{
                default: Main
            }}
        />
    )
}

const Main = () => {
	const [ libraries, setLibraries ] = useState( [] )

	useEffect( () => {
		cloud.libraries.getAll().then( response => {
			setLibraries( response.data )
		} )
	}, [] )

	console.log( libraries )

    return (
        <Page title="Libraries" toolbar={false}>
            <h1>Libraries</h1>
        </Page>
    )
}
