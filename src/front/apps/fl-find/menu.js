import React, { Fragment, useContext } from 'react'
import { useAppState, getAppActions } from 'store'
import { OptionGroup, OptionGroupItem, Separator, AppContext, StackContext } from 'components'
import { getFilterTags } from './filter'

export const MenuContent = () => {
	const { hideAppMenu } = useContext( AppContext )
	const { popToRoot } = useContext( StackContext )
	const { filter } = useAppState()
	const { setType, setDate, setStatus } = getAppActions()
	const { typeTags, dateTags, statusTags } = getFilterTags()
	const { type, subType, date, status } = filter

	const onTypeClick = value => {
		hideAppMenu()
		popToRoot()
		setType( value )
	}

	const currentContentType = [ type, subType ]

	return (
		<Fragment>
			<OptionGroup title="Content Types">
				{ typeTags.map( ( type, i ) => {
					const { label, count, value } = type
					let isSelected = value == currentContentType
					if ( Array.isArray( value ) ) {
						isSelected = JSON.stringify( value ) === JSON.stringify( currentContentType )
					}
					return (
						<OptionGroupItem
							key={i}
							count={count}
							isSelected={isSelected}
							onClick={ () => onTypeClick( value )}
						>{label}</OptionGroupItem>
					)
				} )}
			</OptionGroup>
			<Separator />

			{ 'posts' === type &&
			<Fragment>
				<OptionGroup title="Created">
					{ dateTags.map( ( item, i ) => {
						const { label, value } = item
						let isSelected = date === value ? true : false
						return (
							<OptionGroupItem
								key={i}
								isSelected={isSelected}
								onClick={ () => {
									hideAppMenu()
									popToRoot()
									setDate( value )
								}}
							>{label}</OptionGroupItem>
						)
					} )}
				</OptionGroup>
				<Separator />

				<OptionGroup title="Status">
					{ statusTags.map( ( item, i ) => {
						const { label, value } = item
						let isSelected = status === value ? true : false
						return (
							<OptionGroupItem
								key={i}
								isSelected={isSelected}
								onClick={ () => {
									hideAppMenu()
									popToRoot()
									setStatus( value )
								}}
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
