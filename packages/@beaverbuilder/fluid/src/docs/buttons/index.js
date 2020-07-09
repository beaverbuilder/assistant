import React from 'react'
import Button from '../../button'
import * as Text from '../../text'

export default () => {
	return (
		<Text.ContentArea>
			<h1>Buttons</h1>
			<p>Buttons defined the most basic interaction control in fluid. They can be used for handling click actions, navigating between routes, and navigating away from the page entirely.</p>

			<table>
				<thead>
					<tr>
						<th>State</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Normal</td>
						<td><Button>Button</Button></td>
					</tr>
					<tr>
						<td>Hover</td>
						<td><Button className="is-hovering">Button</Button></td>
					</tr>
					<tr>
						<td>Active</td>
						<td><Button className="is-active">Button</Button></td>
					</tr>
					<tr>
						<td>Focused</td>
						<td><Button className="is-focused">Button</Button></td>
					</tr>
					<tr>
						<td>Disabled</td>
						<td><Button disabled>Button</Button></td>
					</tr>
				</tbody>
			</table>

			<h2>Primary Status</h2>
			<table>
				<thead>
					<tr>
						<th>State</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Normal</td>
						<td><Button status="primary">Button</Button></td>
					</tr>
					<tr>
						<td>Hover</td>
						<td><Button status="primary" className="is-hovering">Button</Button></td>
					</tr>
					<tr>
						<td>Active</td>
						<td><Button status="primary" className="is-active">Button</Button></td>
					</tr>
					<tr>
						<td>Focused</td>
						<td><Button status="primary" className="is-focused">Button</Button></td>
					</tr>
					<tr>
						<td>Disabled</td>
						<td><Button status="primary" disabled>Button</Button></td>
					</tr>
				</tbody>
			</table>
		</Text.ContentArea>
	)
}
