import { __ } from '@wordpress/i18n'
import React, { useContext, useState } from 'react'
import { App, Page, List } from 'assistant/ui'

export const Search = () => {
	const { handle } = useContext( App.Context )

	const [ search, setSearch ] = useState( '' )

	const getQuery = () => {
		return { search: '*' + search + '*' }
	}

	return (
		<Page padX={ false } title={ __( 'All Users' ) }>
			<Page.Toolbar>
				<input type="text" placeholder={ __( 'Find User' ) }
					value={ search }
					onChange={ e => setSearch( e.target.value ) }/>
			</Page.Toolbar>
			<List.Users
				query={ getQuery() }
				getItemProps={ ( item, defaultProps ) => ( {
					...defaultProps,
					to: {
						pathname: `/${handle}/user/${item.id}`,
						state: { item }
					},
				} ) }
			/>
		</Page>
	)
}
