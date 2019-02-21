import React, { Fragment, useContext } from 'react'
import { getConfig, useStore, useAppState } from 'store'
import { OptionGroup, OptionGroupItem, Separator, AppContext } from 'components'

export const MenuContent = ( { appStackContext } ) => {
	const [ type, setType ] = useAppState( 'post-filter-type', 'posts' )
	const [ subType, setSubType ] = useAppState( 'post-filter-sub-type', 'page' )
	const [ date, setDate ] = useAppState( 'post-filter-date-type', '' )
	const [ status, setStatus ] = useAppState( 'post-filter-status-type', 'publish' )
	const { contentTypes, taxonomies } = getConfig()
	const { counts } = useStore()
	const { hideAppMenu } = useContext( AppContext )
	const { popToRoot } = appStackContext
	const typeTags = []
	const now = new Date()

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

	const dateTags = [
		{
			label: 'Any',
			value: '',
		},
		{
			label: 'Today',
			value: 'today',
		},
		{
			label: 'This Week',
			value: 'week',
		},
		{
			label: 'This Month',
			value: 'month',
		},
		{
			label: now.getFullYear(),
			value: 'year'
		}
	]

	const statusTags = [
		{
			label: 'Any',
			value: 'any',
		},
		{
			label: 'Published',
			value: 'publish',
		},
		{
			label: 'Draft',
			value: 'draft',
		},
		{
			label: 'Pending',
			value: 'pending',
		},
		{
			label: 'Scheduled',
			value: 'future',
		},
		{
			label: 'Private',
			value: 'private',
		},
		{
			label: 'Trash',
			value: 'trash',
		},
	]

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
			{ dateTags.map( ( item, i ) => {
				const { label, value } = item
				let isSelected = date === value ? true : false
				return (
					<OptionGroupItem
						key={i}
						isSelected={isSelected}
						onClick={ () => {
							setDate( value )
							hideAppMenu()
							popToRoot()
						}}
					>{label}</OptionGroupItem>
				)
			})}
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
							setStatus( value )
							hideAppMenu()
							popToRoot()
						}}
					>{label}</OptionGroupItem>
				)
			})}
			</OptionGroup>
			<Separator />
		</Fragment>
	)
}
