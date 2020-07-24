import React, { useState, useEffect } from 'react'
import { CancelToken, isCancel } from 'axios'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Layout } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import { addQueryArgs } from 'assistant/utils/url'
import { getWpRest } from 'assistant/utils/wordpress'
import cloud from 'assistant/cloud'

export default ( { onChange } ) => {
	const [ keyword, setKeyword ] = useState( '' )
	const [ isLoading, setIsLoading ] = useState( false )
	const { contentTypes } = getSystemConfig()
	const wp = getWpRest()
	let source = CancelToken.source()

	const getSearchRoutes = () => {
		return Object.entries( contentTypes ).map( ( [ type, data ], key ) => {
			return addQueryArgs( '/fl-assistant/v1/posts', {
				post_type: type,
				s: keyword,
				posts_per_page: -1,
			} )
		} )
	}

	useEffect( () => {
		source.cancel()
		source = CancelToken.source()

		onChange( null )

		if ( '' === keyword ) {
			return
		}

		setIsLoading( true )

		wp.search( keyword, getSearchRoutes(), {
			cancelToken: source.token,
		} ).then( response => {
			const results = []
			const types = Object.values( contentTypes )

			response.data.map( ( result, key ) => {
				if ( ! result.items || ! result.items.length ) {
					return
				}
				results.push( {
					label: types[ key ].labels.plural,
					items: result.items,
				} )
			} )

			onChange( results )
			setIsLoading( false )
		} ).catch( ( error ) => {
			if ( ! isCancel( error ) ) {
				console.log( error ) // eslint-disable-line no-console
			}
		} )

		return () => source.cancel()
	}, [ keyword ] )

	return (
		<Layout.Box>
			<Layout.Headline
				style={ {
					paddingBottom: 'var(--fluid-med-space)'
				} }
			>
				{ __( 'Add Content' ) }
			</Layout.Headline>
			<div style={ { position: 'relative' } }>
				<input
					type='text'
					placeholder={ __( 'Search content...' ) }
					value={ keyword }
					onChange={ e => setKeyword( e.target.value ) }
				/>
				<div
					style={ {
						display: 'flex',
						alignItems: 'center',
						position: 'absolute',
						top: 0,
						right: 3,
						bottom: 0,
					} }
				>
					{ isLoading &&
						<Button
							appearance='transparent'
							size='sm'
						>
							<Icon.Loading />
						</Button>
					}
					{ ! isLoading && '' !== keyword &&
						<Button
							appearance='transparent'
							size='sm'
							onClick={ () => setKeyword( '' ) }
						>
							<Icon.Close />
						</Button>
					}
				</div>
			</div>
		</Layout.Box>
	)
}
