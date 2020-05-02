import React from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemHooks } from 'data'
import Filter from '../'

export const RadioGroupItem = ( { items = {}, title, value, defaultValue, onChange = () => {} } ) => {
	return (
		<Filter.Item
			title={ title }
			subtitle={ items[value] }
			isChanged={ value !== defaultValue }
			hasLoadedItems={ 0 !== Object.keys( items ).length }
		>
			{Object.entries( items ).map( ( [ key, label ], i ) => {
				return (
					<label key={ i }>
						<input
							type="radio"
							value={ key }
							onChange={ e => onChange( key, e ) }
							checked={ value === key }
						/>{label}{ defaultValue === key && (
							<em style={ { marginLeft: 'var(--fluid-sm-space)' } }>
								({ __( 'Default' )})
							</em>
						) }
					</label>
				)
			} )}
		</Filter.Item>
	)
}

export const LabelsItem = ( { ...rest } ) => {
	const { useLabels } = getSystemHooks()
	const [labels] = useLabels( [] )

	const Dot = ( { color, outline, ...rest } ) => {
		return (
			<span
				{ ...rest }
				style={ {
					display: 'inline-block',
					width: 10,
					height: 10,
					backgroundColor: color ? color : 'transparent',
					border: outline ? `2px solid ${outline}` : 'none',
					borderRadius: '50%',
					marginRight: 'var(--fluid-sm-space)'
				} }
			/>
		)
	}
	const items = {
		0: (
			<>
				<Dot outline="var(--fluid-primary-color)" />
				{__( 'Any' )}
			</>
		)
	}

	for ( let key in labels ) {
		const { id, color, label } = labels[ key ]
		items[ id ] = (
			<>
				<Dot color={ color } />
				{label}
			</>
		)
	}

	return (
		<RadioGroupItem
			title={ __( 'Label' ) }
			items={ items }
			{ ...rest }
		/>
	)
}
