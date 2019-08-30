import { __ } from '@wordpress/i18n'
import React, { useContext, useState } from 'fl-react'
import { App, Page, Nav, List } from 'assistant/lib'

export const Search = () => {
	const { handle } = useContext( App.Context )

	const [ search, setSearch ] = useState( '' )

	const getQuery = () => {
		return { search: '*' + search + '*' }
	}

	return (
		<Page shouldPadSides={ false } title={ __( 'All Users' ) } shouldPadTop={ true }>
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
