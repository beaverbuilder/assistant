import React, { Fragment, useContext } from 'react'
import { getConfig, useStore } from 'store'
import { OptionGroup, OptionGroupItem, Separator, AppContext } from 'components'

export const MenuContent = ({ appStackContext }) => {
	const { contentTypes, taxonomies } = getConfig()
	const { counts } = useStore()
	const { hideAppMenu } = useContext( AppContext )
	const { popToRoot } = appStackContext
	const typeTags = []

	Object.keys( contentTypes ).map( type => {
		typeTags.push( {
			label: contentTypes[ type ],
			value: [ 'posts', type ],
			count: counts[ `content/${ type }` ] || '0'
		} )
	} )

	Object.keys( taxonomies ).map( type => {
		typeTags.push( {
			label: taxonomies[ type ],
			value: [ 'terms', type ],
			count: counts[ `taxonomy/${ type }` ] || '0'
		} )
	} )

	const setType = value => {
		hideAppMenu()
		popToRoot()
		// @TODO: hookup filter here
		console.log('selected', value )
	}

	return (
		<Fragment>
			<OptionGroup title="Content Types">
				{ typeTags.map( ( type, i ) => {
					const { label, count, value } = type
					const isSelected = false // @TODO - Connect is selected
					return (
						<OptionGroupItem
							key={i}
							count={count}
							isSelected={isSelected}
							onClick={ () => setType( value )}
						>{label}</OptionGroupItem>
					)
				} )}
			</OptionGroup>
			<Separator />

			<OptionGroup title="Created">
				<OptionGroupItem>Today</OptionGroupItem>
				<OptionGroupItem isSelected={true}>This Week</OptionGroupItem>
				<OptionGroupItem>This Month</OptionGroupItem>
				<OptionGroupItem>2019</OptionGroupItem>
			</OptionGroup>
			<Separator />
		</Fragment>
	)
}
