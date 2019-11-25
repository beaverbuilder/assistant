import React from 'react'
import './style.scss'

export const ValuesTable = ( { fields } ) => {
	return (
		<table className="fl-asst-values-table">
			<tbody>
				{ Object.keys( fields ).map( key => {
					const field = fields[key]
					let value = field.value

					if ( Array.isArray( field.value ) ) {
						value = '[Array]'
					}
					if ( 'undefined' === typeof field.value ) {
						value = 'undefined'
					}
					if ( null === field.value ) {
						value = 'null'
					}

					return (
						<tr key={ key }>
							<td>{key}</td>
							<td>{ typeof field.value }</td>
							<td>{value}</td>
						</tr>
					)
				} ) }
			</tbody>
		</table>
	)
}
