import React, { useEffect, useState } from 'fl-react'
import { __ } from '@wordpress/i18n'
import { createSlug } from 'assistant/utils/url'
import { getWpRest } from 'assistant/utils/wordpress'
import { Color, Control, Page, Table, Button, Icon } from 'assistant/ui'
import './style.scss'

export const App = () => {
	const [ loading, setLoading ] = useState( true )
	const [ labels, setLabels ] = useState( [] )
	const [ editingLabel, setEditingLabel ] = useState( null )
	const [ newLabel, setNewLabel ] = useState( '' )
	const [ newColor, setNewColor ] = useState( '' )
	const wpRest = getWpRest()

	useEffect( () => {
		wpRest.labels().findWhere().then( response => {
			setLoading( false )
			setLabels( [ ...response.data ] )
		} )
	}, [] )

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
		setNewColor( '' )
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
						<div style={{ display: 'flex', flex: '1 1 auto' }}>
							<Button onClick={ () => setEditingLabel( null ) }>{ __( 'Cancel' ) }</Button>
							<Button onClick={ saveLabel } style={{ marginLeft: 'auto' }}>{ __( 'Save' ) }</Button>
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
				<Button.Group appearance="buttons">
					<Button onClick={ () => setEditingLabel( label ) }>{ __( 'Edit' ) }</Button>
					<Button onClick={ () => deleteLabel( label.id ) } className="fl-asst-destructive">
						<Icon.Trash />
					</Button>
				</Button.Group>
			),
		}
	} )

	const InnerSection = ( { children } ) => {
		return (
			<Page.Pad top={ false } sides={ false }>
				{ children }
			</Page.Pad>
		)
	}

	return (
		<Page shouldPadSides={ false }>
			<Page.Section
				className='fl-asst-edit-labels'
				contentStyle={{ paddingTop: 0 }}
			>
				<div>
					{ __( 'Labels allow you to mark posts for organization and collaborate with other users. Below you can add more labels and change the name of existing ones.' ) }
				</div>
				{ loading &&
					<InnerSection>{ __( 'Loading...' ) }</InnerSection>
				}
				{ ! loading && 0 === labels.length &&
					<InnerSection>{ __( 'No labels found.' ) }</InnerSection>
				}
				<Table rows={ rows } />
			</Page.Section>

			<Page.Section
				className='fl-asst-add-label'
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
				<Button onClick={ addLabel }>{ __( 'Add New Label' ) }</Button>
			</Page.Section>

			<Page.Section label={ __( 'Bookmarks' ) }>
				<InnerSection>
					{ __( 'Bookmarks allow you to mark items privately. Only you will be able to see what items you’ve bookmarked.' ) }
				</InnerSection>
			</Page.Section>
		</Page>
	)
}

App.Icon = () => {
	return null
}
