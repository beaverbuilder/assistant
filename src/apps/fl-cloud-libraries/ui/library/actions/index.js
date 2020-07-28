import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Button, Icon } from 'assistant/ui'
import LibraryContext from '../context'

export default () => {
	const history = useHistory()
	const { pathname } = useLocation()
	const { library, showUpload, setShowUpload } = LibraryContext.use()
	const basePath = `/fl-cloud-libraries/${ library.id }`

	const goToUpload = () => {
		setShowUpload( ! showUpload )
		if ( pathname !== basePath ) {
			history.goBack()
		}
	}

	const goToSettings = () => {
		if ( pathname === basePath ) {
			history.push( `${ basePath }/settings` )
		}
	}

	return (
		<>
			<Button
				appearance={ showUpload && ! pathname.includes( '/settings' ) ? '' : 'transparent' }
				onClick={ goToUpload }
				isSelected={ showUpload }
				style={ {
					marginLeft: 'auto'
				} }
			>
				<Icon.Plus />
			</Button>
			<Button
				appearance={ pathname.includes( '/settings' ) ? '' : 'transparent' }
				onClick={ goToSettings }
			>
				<Icon.Cog />
			</Button>
		</>
	)
}
