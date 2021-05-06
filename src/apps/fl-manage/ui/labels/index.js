import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { createSlug } from 'assistant/utils/url'
import { getWpRest } from 'assistant/utils/wordpress'
import { Color, Control, Page, Layout, Button, Icon, Text } from 'assistant/ui'
import { getSystemHooks } from 'assistant/data'
import './style.scss'

const Labels = () => {
	const [ editingLabel, setEditingLabel ] = useState( null )
	const [ newLabel, setNewLabel ] = useState( '' )
	const firstColor = 'var(--fl-asst-blue)'
	const [ newColor, setNewColor ] = useState( firstColor )
	const wpRest = getWpRest()

	const { useLabels } = getSystemHooks()
	const [ labels, setLabels ] = useLabels()

	const getDefaultColor = () => {
		const key = Object.keys( Color.labelColors ).shift()
		return Color.labelColors[ key ]
	}

	const addLabel = () => {
		if ( '' === newLabel ) {
			return
		}

		const slug = createSlug( newLabel )
		let exists = false

		labels.map( label => {
			if ( slug === label.slug ) {
				exists = true
			}
		} )

		if ( ! exists ) {
			wpRest.terms().create( {
				taxonomy: 'fl_asst_label',
				name: newLabel,
				slug: slug,
				parent: '0',
				description: '',
				meta: {
					fl_asst_notation_color: newColor,
				},
			} ).then( response => {
				labels.map( ( label, key ) => {
					if ( slug === label.id ) {
						labels[ key ].id = response.data.id
					}
				} )
			} )

			labels.push( {
				slug,
				id: slug,
				label: newLabel,
				color: newColor ? newColor : getDefaultColor(),
			} )

			setLabels( [ ...labels ] )
		}

		setNewLabel( '' )
		setNewColor( firstColor )
	}

	const saveLabel = () => {
		if ( '' === editingLabel.label ) {
			setEditingLabel( null )
			return
		}

		const slug = createSlug( editingLabel.label )
		let exists = false

		labels.map( label => {
			if ( slug === label.slug && editingLabel.id !== label.id ) {
				exists = true
			}
		} )

		if ( ! exists ) {
			labels.map( ( label, key ) => {
				if ( editingLabel.id === label.id ) {
					wpRest.terms().update( editingLabel.id, 'data', {
						name: editingLabel.label,
						slug: slug,
						meta: {
							fl_asst_notation_color: editingLabel.color,
						},
					} )
					labels[ key ] = editingLabel
					setLabels( [ ...labels ] )
				}
			} )
		}

		setEditingLabel( null )
	}

	const deleteLabel = ( id ) => {
		const warning = __( 'Delete this label? It will be deleted from everywhere it is used.' )
		if ( ! confirm( warning ) ) {
			return
		}
		labels.map( ( label, key ) => {
			if ( id === label.id ) {
				wpRest.terms().update( id, 'trash' )
				labels.splice( key, 1 )
				setLabels( [ ...labels ] )
			}
		} )
	}

	const rows = labels.map( label => {
		if ( editingLabel && editingLabel.id === label.id ) {
			return {
				edit: (
					<>
						<Text.Title style={ { marginBottom: 'var(--fluid-med-space)' } }>{__( 'Edit Label' )}</Text.Title>
						<input
							type='text'
							value={ editingLabel.label }
							onChange={ e => {
								setEditingLabel( {
									...editingLabel,
									label: e.target.value,
								} )
							} }
						/>
						<Control.CirclePicker
							value={ editingLabel.color }
							onChange={ value => {
								setEditingLabel( {
									...editingLabel,
									color: value,
								} )
							} }
						/>
						<div style={ { display: 'flex', flex: '1 1 auto' } }>
							<Button onClick={ () => setEditingLabel( null ) }>{ __( 'Cancel' ) }</Button>
							<Button
								onClick={ saveLabel }
								style={ { marginLeft: 'auto' } }
								status="primary"
							>{ __( 'Save' ) }</Button>
						</div>
					</>
				)
			}
		}

		return {
			color: (
				<div
					className='fl-asst-label-color'
					style={ {
						backgroundColor: label.color
					} }>
				</div>
			),
			label: label.label,
			actions: (
				<>
					<Button
						onClick={ () => setEditingLabel( label ) }
						title={ __( 'Edit Label Text' ) }
						style={ { marginRight: 5 } }
						icon={ <Icon.Edit /> }
					/>
					<Button
						onClick={ () => deleteLabel( label.id ) }
						status="destructive"
						title={ __( 'Delete Label' ) }
						icon={ <Icon.Trash /> }
					/>
				</>
			),
		}
	} )

	return (
		<div className="fl-asst-edit-labels">
			<p style={ { marginTop: 0 } }>
				{ __( 'Labels allow you to mark posts or pages for organization and collaborate with other users. Below you can add more labels and change the name of existing ones. Add labels to posts inside the Content app.' ) }
			</p>
			<Layout.Table rows={ rows } />

			<Page.Section
				label={ __( 'Create New Label' ) }
				className='fl-asst-add-label'
				style={ { marginTop: 'auto' } }
			>
				<input
					type='text'
					placeholder={ __( 'Add Label' ) }
					value={ newLabel }
					onChange={ e => setNewLabel( e.target.value ) }
				/>
				<Control.CirclePicker
					value={ newColor }
					onChange={ value => setNewColor( value ) }
				/>
				<Button onClick={ addLabel }>{ __( 'Create New Label' ) }</Button>
			</Page.Section>
		</div>
	)
}

export default Labels
