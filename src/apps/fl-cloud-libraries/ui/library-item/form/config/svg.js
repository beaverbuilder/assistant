import React, { useRef, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { getWpRest } from 'assistant/utils/wordpress'
import cloud from 'assistant/cloud'
import ItemContext from '../../context'

export const getTabs = ( item, tabs ) => {
	tabs.editor = {
		label: __( 'Editor' ),
		sections: {
			general: {
				fields: {
					xml: {
						component: 'textarea',
						rows: 20,
						className: 'fl-asst-svg-editor'
					}
				}
			}
		}
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

	const importSvg = () => {
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

	const replaceSvg = ( e ) => {
		const reader = new FileReader()

		reader.onerror = () => {
			createNotice( {
				status: 'error',
				content: __( 'Error reading file.' )
			} )
		}

		reader.onload = e => {
			const data = {
				data: {
					...item.data,
					xml: e.target.result
				}
			}
			setReplacing( true )
			cloud.libraries.updateItem( item.id, data ).then( response => {
				setItem( response.data )
			} ).catch( error => {
				createNotice( {
					status: 'error',
					content: error.response.data.message
				} )
			} ).finally( () => {
				setReplacing( false )
			} )
		}

		reader.readAsText( e.target.files[0] )
	}

	const NewFileInput = () => {
		return (
			<input
				type='file'
				onChange={ replaceSvg }
				ref={ inputRef }
				accept='image/svg+xml'
				style={ {
					display: 'none'
				} }
			/>
		)
	}

	return [
		{
			label: __( 'Import' ),
			onClick: importSvg,
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
	const { xml } = item.data
	return {
		...defaults,
		xml
	}
}

export const getData = ( item, values, data ) => {
	item.data.xml = values.xml
	data.append( 'data', JSON.stringify( item.data ) )
	return data
}
