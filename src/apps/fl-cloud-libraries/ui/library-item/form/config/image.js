import React, { useRef, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { getWpRest } from 'assistant/utils/wordpress'
import cloud from 'assistant/cloud'
import ItemContext from '../../context'

export const getTabs = ( item, tabs ) => {
	tabs.settings.sections.info = {
		label: __( 'Info' ),
		fields: {
			type: {
				label: __( 'Type' ),
				labelPlacement: 'beside',
				component: 'plain-text',
			},
			size: {
				label: __( 'Size' ),
				labelPlacement: 'beside',
				component: 'plain-text',
			},
		},
	}
	return {
		...tabs,
	}
}

export const getActions = ( item ) => {
	const { setItem, createNotice } = ItemContext.use()
	const [ importing, setImporting ] = useState( false )
	const [ replacing, setReplacing ] = useState( false )
	const inputRef = useRef()
	const wpRest = getWpRest()

	const importImage = () => {
		setImporting( true )
		wpRest.libraries().importItem( item ).then( response => {
			createNotice( {
				status: response.data.error ? 'error' : 'success',
				content: response.data.error ? response.data.error : __( 'Item imported!' )
			} )
		} ).catch( error => {
			createNotice( {
				status: 'error',
				content: error.response.data.message
			} )
		} ).finally( () => {
			setImporting( false )
		} )
	}

	const replaceImage = ( e ) => {
		const data = new FormData()
		data.append( 'media[file]', e.target.files[0] )
		setReplacing( true )

		cloud.libraries.updateItem( item.id, data ).then( response => {
			setItem( response.data )
			createNotice( {
				status: 'success',
				content: __( 'File replaced!' )
			} )
		} ).catch( error => {
			createNotice( {
				status: 'error',
				content: error.response.data.message
			} )
		} ).finally( () => {
			setReplacing( false )
		} )
	}

	const NewFileInput = () => {
		return (
			<input
				type='file'
				onChange={ replaceImage }
				ref={ inputRef }
				accept='image/jpg,image/gif,image/png'
				style={ {
					display: 'none'
				} }
			/>
		)
	}

	return [
		{
			label: __( 'Import' ),
			onClick: importImage,
			disabled: importing
		},
		{
			label: (
				<>
					{ __( 'Replace File' ) }
					<NewFileInput />
				</>
			),
			onClick: () => inputRef.current.click(),
			disabled: replacing,
		}
	]
}

export const getDefaults = ( item, defaults ) => {
	const { media } = item
	if ( media.file ) {
		defaults.type = media.file.mime_type.split( '/' ).pop()
		defaults.size = media.file.size
	}
	return {
		...defaults,
	}
}

export const getData = ( item, values, data ) => {
	return data
}
