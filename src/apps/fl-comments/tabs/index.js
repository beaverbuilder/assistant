import React, { useContext } from 'react'
import { __ } from '@wordpress/i18n'
import { List, App, Page } from 'assistant/ui'


export const AllTab = () => {

	const { handle } = useContext( App.Context )

	return (
		<>


			<Page.Section label={ __( 'All Comments' ) } shouldPadSides={ false }>
				<List.Comments
					type ="all"
					getItemProps={ ( item, defaultProps ) => ( {
						...defaultProps,
						to: {
							pathname: `/${handle}/comment/${item.id}`,
							state: { item }
						},
					} ) }
				/>
			</Page.Section>
		</>
	)
}

export const CommentTypeTab = ( { type = 'all', label = 'All Comments' } ) => {
	const { handle } = useContext( App.Context )


	return (
		<>
		<Page.Section label={ __( label ) } shouldPadSides={ false }>

			<List.Comments
				type ={ type }
				getItemProps={ ( item, defaultProps ) => ( {
					...defaultProps,
					to: {
						pathname: `/${handle}/comment/${item.id}`,
						state: { item }
					},
				} ) }
			/>


		</Page.Section>
		</>
	)
}


