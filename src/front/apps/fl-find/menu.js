import React, { Fragment } from 'react'
import { getConfig, useStore } from 'store'
import { OptionGroup, OptionGroupItem, Separator } from 'components'

export const MenuContent = () => {
	const { contentTypes, taxonomies } = getConfig()
    const { counts } = useStore()
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

	return (
		<Fragment>
			<OptionGroup title="Content Types">
            { typeTags.map( ( type, i ) => {
                const { label } = type
                return (
                    <OptionGroupItem key={i}>{label}</OptionGroupItem>
                )
            })}
			</OptionGroup>
			<Separator />

			<OptionGroup title="Last Edited">
				<OptionGroupItem>Today</OptionGroupItem>
				<OptionGroupItem isSelected={true}>This Week</OptionGroupItem>
				<OptionGroupItem>This Month</OptionGroupItem>
				<OptionGroupItem>2019</OptionGroupItem>
			</OptionGroup>
			<Separator />
		</Fragment>
	)
}
