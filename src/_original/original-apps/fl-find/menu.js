import React, { Fragment, useContext } from 'react'
import { __ } from '@wordpress/i18n'
import { useAppState, getAppActions } from 'data'
import {
	OptionGroup,
	OptionGroupItem,
	Separator,
	AppContext,
	StackContext
} from 'components'
import { getFilterTags } from './filter'

export const MenuContent = () => {
	const { hideAppMenu } = useContext( AppContext )
	const { dismissAll } = useContext( StackContext )
	const { filter } = useAppState()
	const { setType, setDate, setStatus } = getAppActions()
	const { typeTags, dateTags, statusTags } = getFilterTags()
	const { type, subType, date, status } = filter

	const onTypeClick = value => {
		hideAppMenu()
		dismissAll()
		setType( value )
	}

	const currentContentType = [ type, subType ]

	return (
		<Fragment>
			<OptionGroup title={ __( 'Content Types' ) }>
				{ typeTags.map( ( type, i ) => {
					const { label, count, value } = type
					let isSelected = value == currentContentType
					if ( Array.isArray( value ) ) {
						isSelected = JSON.stringify( value ) === JSON.stringify( currentContentType )
					}
					return (
						<OptionGroupItem
							key={ i }
							count={ count }
							isSelected={ isSelected }
							onClick={ () => onTypeClick( value ) }
						>{label}</OptionGroupItem>
					)
				} )}
			</OptionGroup>
			<Separator />

			{ 'posts' === type &&
			<Fragment>
				<OptionGroup title={ __( 'Created' ) }>
					{ dateTags.map( ( item, i ) => {
						const { label, value } = item
						let isSelected = date === value ? true : false
						return (
							<OptionGroupItem
								key={ i }
								isSelected={ isSelected }
								onClick={ () => {
									hideAppMenu()
									dismissAll()
									setDate( value )
								} }
							>{label}</OptionGroupItem>
						)
					} )}
				</OptionGroup>
				<Separator />

				<OptionGroup title={ __( 'Status' ) }>
					{ statusTags.map( ( item, i ) => {
						const { label, value } = item
						let isSelected = status === value ? true : false
						return (
							<OptionGroupItem
								key={ i }
								isSelected={ isSelected }
								onClick={ () => {
									hideAppMenu()
									dismissAll()
									setStatus( value )
								} }
							>{label}</OptionGroupItem>
						)
					} )}
				</OptionGroup>
				<Separator />
			</Fragment>
			}
		</Fragment>
	)
}
