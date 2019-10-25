import React, { useState } from 'react'
import { Switch, Route } from 'fl-react-router-dom'
import { Page } from 'assistant/lib'
import Unsplash from 'unsplash-js'

const unsplash = new Unsplash( {
	applicationId: 'c09e42c595ba312b458f788cd08934dbf79834aacf4c205f4561ef8bdcedefc9',
	secret: 'a3edadbe892968502ae3a1191bea92cb44daebad80c1c18fcbadf9a48c1a4673'
} )

export const UnsplashExample = ( { match } ) => (
	<Switch>
		<Route exact path={ `${match.url}/` } component={ Main } />
	</Switch>
)

const Main = () => {
	const [ term, setTerm ] = useState( '' )
	const [ results, setResults ] = useState( [] )

	const onChange = e => {
		const value = e.currentTarget.value
		setTerm( value )

		if ( '' === value  ) {
			setResults( [] )
			return
		}

		unsplash.search.photos( value, 1 )
			.then( response => response.json() )
			.then( data => {
				setResults( data.results )
			} )
	}

	const onDrag = () => {

		// Args passed - (item, e)

		// Import photo into WP media library here

		// For unsplash tracking purposes
		//unsplash.photos.downloadPhoto(item)
	}

	return (
		<Page>
			<Page.Toolbar>
				<input type="text" value={ term } onChange={ onChange }  style={ { color: 'black', width: '100%' } } />
			</Page.Toolbar>
			<ul>
				{ results.map( ( item, i ) => {
					const { urls } = item
					return (
						<li key={ i }>
							<img
								draggable
								onDragStart={ e => {
									onDrag( item, e )
								} }
								src={ urls.small }
							/>
						</li>
					)
				} )}
			</ul>
		</Page>
	)
}
