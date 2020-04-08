import { __ } from '@wordpress/i18n'
import React, { useContext, useState } from 'react'
import { App, Page, List, Layout } from 'assistant/ui'

export const Search = () => {
	const { handle } = useContext( App.Context )

	const [ search, setSearch ] = useState( '' )

	const getQuery = () => {
		return { search: '*' + search + '*' }
	}

	return (
		<Page padX={ false } title={ __( 'All Users' ) }>
			<Layout.Row>
				<input type="text" placeholder={ __( 'Find User' ) }
					value={ search }
					onChange={ e => setSearch( e.target.value ) }/>
			</Layout.Row>
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
