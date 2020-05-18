import React from 'react'
import classname from 'classnames'
import './style.scss'

const Table = ( {
	headings = [],
	rows = [],
} ) => {
	return (
		<div className='fl-asst-table'>
			{ 0 < headings.length &&
				<div className='fl-asst-table-row fl-asst-table-header'>
					{ Object.keys( headings ).map( key =>
						<div key={ key } className='fl-asst-table-cell fl-asst-table-heading'>
							{ headings[ key ] }
						</div>
					) }
				</div>
			}
			{ rows.map( ( row, i ) => {
				return (
					<div key={ i } className='fl-asst-table-row'>
						{ Object.keys( row ).map( ( key, k ) => {
							return (
								<div
									key={ k }
									className={ classname( {
										'fl-asst-table-cell': true,
										[ `fl-asst-table-cell-${ key }` ]: true,
									} ) }
								>
									{ row[ key ] }
								</div>
							)
						} ) }
					</div>
				)
			} ) }
		</div>
	)
}

export default Table
