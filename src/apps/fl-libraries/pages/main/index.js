import React, { useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Button } from 'assistant/ui'
import cloud from 'assistant/utils/cloud'

export default ({ baseURL }) => {
	const [isLoading, setIsLoading] = useState( true )
	const [libraries, setLibraries] = useState( [] )

	useEffect( () => {
		cloud.libraries.getAll().then( response => {
			setLibraries( response.data.libraries )
			setIsLoading( false )
		} )
	}, [] )

	if ( isLoading ) {
		return <Page.Loading />
	}

    return (
        <Page
			title={__('Libraries')}
			showAsRoot={ true }
		>
			<ul>
			{ libraries.map( ({ name, id }) => {
				return (
					<li>
						<Button to={`${baseURL}/library/${id}`}>{name}</Button>
					</li>
				)
			})}
			</ul>
        </Page>
    )
}
