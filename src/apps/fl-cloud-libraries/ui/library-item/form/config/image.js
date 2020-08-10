import React, { useRef, useState } from 'react'
import { __ } from '@wordpress/i18n'
import cloud from 'assistant/cloud'
import ItemContext from '../../context'

export const getTabs = ( item, tabs ) => {
	return {
		...tabs,
	}
}

export const getActions = ( item ) => {
	const { setItem, createNotice } = ItemContext.use()
	const [ replacing, setReplacing ] = useState( false )
	const inputRef = useRef()

	const importImage = () => {

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
	return {
		...defaults,
	}
}

export const getData = ( item, values, data ) => {
	return data
}
