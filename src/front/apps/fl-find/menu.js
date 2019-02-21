import React, { Fragment, useContext } from 'react'
import { getConfig, useStore, useAppState } from 'store'
import { OptionGroup, OptionGroupItem, Separator, AppContext } from 'components'

export const MenuContent = ( { appStackContext } ) => {
	const [ type, setType ] = useAppState( 'post-filter-type', 'posts' )
	const [ subType, setSubType ] = useAppState( 'post-filter-sub-type', 'page' )
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

	const onTypeClick = value => {
		hideAppMenu()
		popToRoot()
		setType( value[0] )
		setSubType( value[1] )
	}

	const currentContentType = [type, subType]

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
