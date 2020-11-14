import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { useSystemState } from 'data'
import { Button, Color, Control, Form, Icon, Menu } from 'ui'
import './style.scss'

export const LabelsItem = ( {
	value,
	onChange = () => {},
	onAdd = () => {},
	onRemove = () => {},
} ) => {
	const { labels } = useSystemState()
	const [ isMenuShowing, setIsMenuShowing ] = useState( false )

	const removeLabel = ( option ) => {
		const i = value.indexOf( option.id )
		value.splice( i, 1 )
		onChange( [ ...value ] )
		onRemove( option )
	}

	const addLabel = ( id ) => {
		labels.map( option => {
			if ( option.id === Number( id ) && ! value.includes( option.id ) ) {
				value.push( option.id )
				onChange( [ ...value ] )
				onAdd( option )
			}
		} )
	}

	const tags = []
	labels.map( option => {
		if ( value.includes( option.id ) ) {
			tags.push( option )
		}
	} )

	const MenuContent = () => {
		return labels.map( ( option, i ) =>
			<label key={ i } className='fl-asst-labels-menu-item'>
				<div
					className='fl-asst-labels-menu-color'
					style={ {
						backgroundColor: option.color
					} }
				/>
				<div className='fl-asst-labels-menu-label'>
					{ option.label }
				</div>
				<Form.CheckboxItem
					value={ value.includes( option.id ) }
					onChange={ checked => {
						if ( checked ) {
							addLabel( option.id )
						} else {
							removeLabel( option )
						}
					} }
				/>
			</label>
		)
	}

	return (
		<div className='fl-asst-labels-item'>
			<Control.TagGroup
				value={ tags }
				onRemove={ removeLabel }
				colors={ Color.knownColors }
			>
				<Menu
					content={ <MenuContent /> }
					isShowing={ isMenuShowing }
					onOutsideClick={ () => setIsMenuShowing( false ) }
					className="fl-asst-label-picker-menu"
				>
					<Button
						className='fl-asst-tag-add-button'
						status={ isMenuShowing ? 'primary' : '' }
						onClick={ () => setIsMenuShowing( ! isMenuShowing ) }
					>
						<span style={ { marginRight: 'var(--fluid-med-space)' } }>
							<Icon.PlusSmall />
						</span>
						{ __( 'Add Label' ) }
					</Button>
				</Menu>
			</Control.TagGroup>
		</div>
	)
}
