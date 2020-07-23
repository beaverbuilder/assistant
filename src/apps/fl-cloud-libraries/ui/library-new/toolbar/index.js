import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Button, Icon, Layout } from 'assistant/ui'

export default ( { library } ) => {
	const history = useHistory()

	const goto = ( route ) => {
		history.push( route )
	}

	return (
		<Layout.Toolbar>
			<div>{ __( 'View By:' ) }</div>
			<Button
				appearance='transparent'
				onClick={ () => goto( `/fl-cloud-libraries/${ library.id }` ) }
			>
				{ __( 'Type' ) }
			</Button>
			<Button
				appearance='transparent'
				onClick={ () => goto( `/fl-cloud-libraries/${ library.id }` ) }
			>
				{ __( 'Collection' ) }
			</Button>
			{ library.permissions.update &&
				<>
					<Button
						size='sm'
						appearance='transparent'
						onClick={ () => goto( `/fl-cloud-libraries/${ library.id }` ) }
						style={ {
							marginLeft: 'auto'
						} }
					>
						<Icon.Plus />
					</Button>
					<Button
						size='sm'
						appearance='transparent'
						onClick={ () => goto( `/fl-cloud-libraries/${ library.id }/settings` ) }
					>
						<Icon.Cog />
					</Button>
				</>
			}
		</Layout.Toolbar>
	)
}
