import React, { Fragment, useContext } from 'react'
import { __ } from '@wordpress/i18n'
import { useAppState, getAppActions, getSystemConfig, useSystemState } from 'data'
import {
	CreatePost,
	CreateTerm,
	TagGroupControl,
	Header,
	Heading,
	NavBar,
	NewButton,
	Padding,
	StackContext,
	Title,
} from 'components'

export const PostListFilter = ( { refreshList } ) => {
	const { contentTypes, taxonomies } = getSystemConfig()
	const { present, dismissAll } = useContext( StackContext )
	const { filter } = useAppState()
	const { setType, setDate, setStatus } = getAppActions()
	const { typeTags, dateTags, statusTags } = getFilterTags()
	const { type, subType, date, status } = filter
	let navItems = []
	let title = __( 'Content' )

	typeTags.map( item => {

		if ( 1 > item.count ) {
			return
		}

		const isSelected = JSON.stringify( [ type, subType ] ) === JSON.stringify( item.value )

		if ( isSelected ) {
			title = item.label
		}

		navItems.push( {
			children: item.label,
			onClick: () => {
				setType( item.value )
				dismissAll()
			},
			isSelected,
		} )
	} )

	const presentNew = () => {
		if ( 'posts' === type ) {
			present( {
				label: contentTypes[ subType ].labels.newItem,
				content: <CreatePost />,
				appearance: 'form',
				context: {
					refreshList,
					type: subType,
					...contentTypes[ subType ],
				}
			} )
		} else if ( 'terms' === type ) {
			present( {
				label: taxonomies[ subType ].labels.newItem,
				content: <CreateTerm />,
				appearance: 'form',
				context: {
					refreshList,
					type: subType,
					...taxonomies[ subType ],
				}
			} )
		}
	}

	const Actions = () => {
		return <NewButton onClick={ presentNew } />
	}

	return (
		<Fragment>

			<Header>
				<NavBar items={ navItems } maxItems={ 5 } />
			</Header>

			<Header.Expanded>
				<Padding>
					<Heading>{__( 'Filters' )}</Heading>
					<TagGroupControl
						title={ __( 'Type' ) }
						tags={ typeTags }
						value={ [ type, subType ] }
						onChange={ value => {
							setType( value )
							dismissAll()
						} }
						appearance="muted"
					/>

					{ 'posts' === type &&
						<Fragment>
							<TagGroupControl
								tags={ dateTags }
								value={ date }
								title={ __( 'Created' ) }
								onChange={ value => {
									setDate( value )
									dismissAll()
								} }
								appearance="muted"
							/>

							{ 'attachment' !== subType &&
								<TagGroupControl
									tags={ statusTags }
									value={ status }
									title={ __( 'Status' ) }
									onChange={ value => {
										setStatus( value )
										dismissAll()
									} }
									appearance="muted"
								/>
							}
						</Fragment>
					}
				</Padding>
			</Header.Expanded>

			<Title actions={ <Actions /> } >{ title }</Title>
		</Fragment>
	)
}

export const getFilterTags = () => {
	const { counts } = useSystemState()
	const { contentTypes, taxonomies } = getSystemConfig()
	const now = new Date()
	const typeTags = []

	Object.keys( contentTypes ).map( type => {
		typeTags.push( {
			label: contentTypes[ type ].labels.plural,
			value: [ 'posts', type ],
			count: counts[ `content/${ type }` ] || '0'
		} )
	} )

	Object.keys( taxonomies ).map( type => {
		typeTags.push( {
			label: taxonomies[ type ].labels.plural,
			value: [ 'terms', type ],
			count: counts[ `taxonomy/${ type }` ] || '0'
		} )
	} )

	const dateTags = [
		{
			label: __( 'Any' ),
			value: '',
		},
		{
			label: __( 'Today' ),
			value: 'today',
		},
		{
			label: __( 'This Week' ),
			value: 'week',
		},
		{
			label: __( 'This Month' ),
			value: 'month',
		},
		{
			label: now.getFullYear(),
			value: 'year'
		}
	]

	const statusTags = [
		{
			label: __( 'Any' ),
			value: 'any',
		},
		{
			label: __( 'Published' ),
			value: 'publish',
		},
		{
			label: __( 'Draft' ),
			value: 'draft',
		},
		{
			label: __( 'Pending' ),
			value: 'pending',
		},
		{
			label: __( 'Scheduled' ),
			value: 'future',
		},
		{
			label: __( 'Private' ),
			value: 'private',
		},
		{
			label: __( 'Trash' ),
			value: 'trash',
		},
	]

	return {
		typeTags,
		dateTags,
		statusTags,
	}
}
