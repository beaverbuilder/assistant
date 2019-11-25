import React from 'react'
import { List } from 'ui'

export const TestSheet = () => {

	const padSides = { padding: '0 var(--fl-asst-outer-space)' }

	const SimpleDataExample = () => {
		const items = [ 'Red', 'Green', 'Blue', 'Orange', 'Yellow', 'rebeccapurple', 'rgba(0,0,0,.4)' ]
		return (
			<>
				<h2 style={ padSides }>Simple Data Example</h2>
				<List
					items={ items }
					defaultItemProps={ { thumbnailSize: 'sm' } }
				/>
			</>
		)
	}

	const DataDrivenExample = () => {
		const items = [
			{
				label: 'Post One',
				caption: 'This is something you really want to see.'
			},
			{
				label: 'Post Two- This one has a really long title so we\'ll need to deal with that',
				caption: 'This is something you really want to see.',
				thumb: 'https://images.unsplash.com/photo-1560932668-46f7a662129e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
			},
			{
				label: 'Post Three',
				caption: 'This is something you really want to see.',
				img: 'https://images.unsplash.com/photo-1560866564-d9b7dcecb5fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
			},
			{
				label: 'Post Four',
				description: 'Hey this is a description!',
				img: 'https://images.unsplash.com/photo-1560866564-d9b7dcecb5fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
			},
			{
				label: 'Post Five',
				img: 'https://images.unsplash.com/photo-1561211950-8b1eb6114d6a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
			},
		]
		return (
			<>
				<h2 style={ padSides }>Array-Driven List</h2>
				<List items={ items } />
			</>
		)
	}

	const SectionedListExample = () => {
		const items = [
			{
				label: 'Section One',
				type: 'list-section',
				items: [
					{ title: 'Sectioned Post One' },
					{ title: 'Sectioned Post Two' },
					{ title: 'Sectioned Post Three' },
				],
			},
			{
				label: 'Section Two',
				type: 'list-section',
				items: [
					{ title: 'Sectioned Post Four' },
					{ title: 'Sectioned Post Five' },
				],
			},
		]
		return (
			<>
				<h2 style={ padSides }>Sectioned List</h2>
				<List
					items={ items }
					isListSection={ item => 'undefined' !== typeof item.items }
					getSectionItems={ section => section.items }
				/>
			</>
		)
	}

	const FeedExample = () => {
		const items = [
			{
				type: 'plugin',
				message: 'Justin Installed A New Plugin',
				pluginName: 'Classic Editor',
				pluginIcon: 'https://ps.w.org/ninja-forms/assets/icon-256x256.png?rev=1649747'
			},
			{
				type: 'plugin',
				message: 'Plugin Was Updated',
				pluginName: 'Gutenberg',
				pluginIcon: 'https://ps.w.org/gutenberg/assets/icon-256x256.jpg?rev=1776042'
			},
			{
				type: 'post',
				message: 'Brent edited page',
				postTitle: '10 Ways that Spotify can help creatives be more productive!',
				thumbnail: 'https://cdn.dribbble.com/users/478776/screenshots/5895318/brindle.jpg',
				actions: [
					{ label: 'View', to: '/posts/3' },
					{ label: 'Edit', href: 'http://www.google.com' }
				]
			},
		]

		const Row = ( { tag: Tag = 'li', children } ) => {
			const style = {
				margin: 'var(--fl-asst-tiny-space)',
				marginTop: 0,
				padding: 'var(--fl-asst-inner-space) var(--fl-asst-outer-space)',
				background: 'var(--fl-asst-secondary-surface-background)',
				borderRadius: 7,
			}
			return (
				<Tag className="fl-asst-list-item" style={ style }>{children}</Tag>
			)
		}

		const Plugin = ( { message, pluginName, pluginIcon } ) => {
			return (
				<Row>
					<div style={ { marginBottom: 'var(--fl-asst-tiny-space)' } }>{message}</div>
					<div style={ { display: 'flex', flexDirection: 'row' } }>
						<div style={ { marginRight: 'var(--fl-asst-inner-space)' } }>
							<img src={ pluginIcon } style={ { width: 30, height: 30 } } />
						</div>
						<div>{pluginName}</div>
					</div>
				</Row>
			)
		}

		const Post = ( { message, postTitle: title, thumbnail } ) => {
			return (
				<Row>
					<div style={ { marginBottom: 'var(--fl-asst-tiny-space)' } }>{message}</div>
					<div style={ { display: 'flex', flexDirection: 'row' } }>
						<img src={ thumbnail } style={ { width: 60, height: 60, marginRight: 'var(--fl-asst-inner-space)' } } />
						<div>{title}</div>
					</div>
				</Row>
			)
		}

		const getComponent = item => {
			switch ( item.type ) {
			case 'plugin':
				return Plugin
			case 'post':
				return Post
			default:
				return List.Item
			}
		}

		return (
			<>
				<h2 style={ padSides }>Heterogeneous Types Example</h2>
				<List
					items={ items }
					getItemComponent={ getComponent }
				/>
			</>
		)
	}

	///// THE Render //////
	return (
		<>
			<SimpleDataExample />
            <hr/>
			<DataDrivenExample />
            <hr/>
			<SectionedListExample />
            <hr/>
			<FeedExample />
		</>
	)
}
