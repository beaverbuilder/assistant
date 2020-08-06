import React from 'react'
import * as Layout from '../../layout'
import * as List from '../../list'
import * as Text from '../../text'

export default () => {

	const HTMLTableExample = () => {

		const items = [
			{
				id: 1,
				firstName: 'Justin',
				lastName: 'Busa',
			},
			{
				id: 2,
				firstName: 'Billy',
				lastName: 'Young',
			},
			{
				id: 3,
				firstName: 'Robby',
				lastName: 'McCullough',
			},
			{
				id: 4,
				firstName: 'Anthony',
				lastName: 'Tran',
			},
			{
				id: 5,
				firstName: 'Brent',
				lastName: 'Jett',
			},
		]

		const Row = props => <tr { ...props } />
		const Cell = props => <td className="cell" { ...props } />
		const MainCell = ( { title, description, ...rest } ) => {
			return (
				<td className="cell main-cell" { ...rest }>
					<Text.Title
						subtitle={ description }
					>{title}</Text.Title>
				</td>
			)
		}
		const getCell = name => 'main' === name ? MainCell : Cell

		return (
			<>
				<h2>Standard HTML Table</h2>
				<table>
					<tbody>
						<List.Iterator
							items={ items }
							getRow={ () => Row }
							getCell={ getCell }
							getCellNames={ () => [ 'main', 'first', 'last' ] }
							getCellProps={ ( cellName, item, defaults ) => {
								switch ( cellName ) {
								case 'last':
									return {
										...defaults,
										children: item.lastName
									}
								case 'first':
									return {
										...defaults,
										children: item.firstName
									}
								default:
									return {
										...defaults,
										title: `${item.firstName} ${item.lastName}`,
										description: `id: ${item.id}`
									}
								}
							} }
						/>
					</tbody>
				</table>
			</>
		)
	}

	const SimpleListExample = () => {
		const items = [ 'red', 'green', 'blue', 'orange', 'yellow' ]
		return (
			<>
				<h2>Simple Unordered List</h2>
				<ul>
					<List.Iterator
						items={ items }
						getCell={ () => 'li' }
						getCellProps={ ( cellName, item, defaults ) => ( {
							...defaults,
							children: item
						} ) }
					/>
				</ul>
			</>
		)
	}

	return (
		<Layout.ContentBoundary>
			<h1>Lists</h1>
			<p>Lists are how you list things...</p>

			<HTMLTableExample />
			<SimpleListExample />
		</Layout.ContentBoundary>
	)
}
