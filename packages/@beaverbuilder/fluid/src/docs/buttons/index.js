import React from 'react'
import Button from '../../button'
import * as Text from '../../text'
import * as Icon from '../../icon'

export default () => {
	return (
		<Text.ContentArea style={ { paddingBottom: 60 } }>
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

			<h2>Transparent Appearance</h2>
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
						<td><Button appearance="transparent">Button</Button></td>
					</tr>
					<tr>
						<td>Hover</td>
						<td><Button appearance="transparent" className="is-hovering">Button</Button></td>
					</tr>
					<tr>
						<td>Active</td>
						<td><Button appearance="transparent" className="is-active">Button</Button></td>
					</tr>
					<tr>
						<td>Focused</td>
						<td><Button appearance="transparent" className="is-focused">Button</Button></td>
					</tr>
					<tr>
						<td>Disabled</td>
						<td><Button appearance="transparent" disabled>Button</Button></td>
					</tr>
				</tbody>
			</table>

			<h2>Elevator Appearance</h2>
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
						<td><Button appearance="elevator"><Icon.Edit /></Button></td>
					</tr>
					<tr>
						<td>Hover</td>
						<td><Button appearance="elevator" className="is-hovering"><Icon.Edit /></Button></td>
					</tr>
					<tr>
						<td>Active</td>
						<td><Button appearance="elevator" className="is-active"><Icon.Edit /></Button></td>
					</tr>
					<tr>
						<td>Focused</td>
						<td><Button appearance="elevator" className="is-focused"><Icon.Edit /></Button></td>
					</tr>
					<tr>
						<td>Disabled</td>
						<td><Button appearance="elevator" disabled><Icon.Edit /></Button></td>
					</tr>
				</tbody>
			</table>

			<h2>Icon Buttons</h2>
			<table>
				<tbody>
					<tr>
						<td>
							<Button icon="view">Icon Button</Button>
						</td>
						<td>
							<Button isLoading>Loading</Button>
						</td>
					</tr>
					<tr>
						<td>
							<Button icon={ <Icon.BookmarkSolid /> }>Bookmark</Button>
						</td>
						<td>
							<Button icon="bookmark-solid">Bookmark</Button>
						</td>
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
