import React, { Fragment } from 'react'

const prepare = items => {
	if ( ! Array.isArray( items ) ) {
		return Object.values( items )
	}
	return items
}

const defaultGetCellProps = ( cellName, props, defaults = {} ) => {
	return defaults
}

const Iterator = ( {
	items = [],

	getCell = () => Fragment,
	getCellProps = defaultGetCellProps,
	getCellNames = () => [ 'main' ],

	getRow = () => Fragment,
	getRowProps = () => {},
} ) => {
	const cellNames = getCellNames( items )
	const Row = getRow( items )

	return prepare( items ).map( ( item, i ) => {
		const props = getRowProps( item )
		return (
			<Row key={i} {...props}>
			{ cellNames.map( ( name, i ) => {
				const Cell = getCell( name, item )
				const props = getCellProps( name, item, i )
				return (
					<Cell key={ i } {...props} />
				)
			})}
			</Row>
		)
	} )
}

export default Iterator
