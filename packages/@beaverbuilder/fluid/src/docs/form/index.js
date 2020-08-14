import React from 'react'
import * as Layout from '../../layout'

const FormSheet = () => {
	return (
		<Layout.ContentBoundary>
			<h1>Form Controls</h1>

			<Row>
				<input value="Generic Input" />
			</Row>
			<Row>
				<input type="text" placeholder="Placeholder Text" />
			</Row>
			<Row>
				<label>Label Text</label>
				<input type="text" placeholder="Placeholder Text" />
			</Row>
			<Row>
				<label>Label Text</label>
				<select>
					<option>Select Box</option>
				</select>
			</Row>
			<Row>
				<input type="checkbox" />
			</Row>
			<Row>
				<input type="checkbox" checked />
			</Row>
		</Layout.ContentBoundary>
	)
}

const Row = ( { children, ...rest } ) => (
	<div style={ {
		marginBottom: 20,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	} } { ...rest }>
		{children}
	</div>
)

export default FormSheet
