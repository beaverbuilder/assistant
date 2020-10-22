import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Button, Layout, Icon } from '@beaverbuilder/fluid'

export default () => {
	const baseURL = '/designsystem/buttons'
	return (
		<>
			<Switch>
				<Route exact path={ `${baseURL}/` } component={ Main } />
			</Switch>
		</>
	)
}

const Main = () => {
	return (
		<Layout.ContentBoundary style={ { paddingBottom: 60 } }>
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

			<h2 id="buttons-transparent">Transparent Appearance</h2>
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

			<h2 id="buttons-elevator">Elevator Appearance</h2>
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

			<h2 id="buttons-icon">Icon Buttons</h2>
			<p>Buttons support the <code>icon</code> prop. It can recieve a rendered component or the name of an icon that it will look up from the icon library. If you are referring to a multi-word icon (ex <code>Icon.BookmarkSolid</code> ) change the name to lowercase with dashes between words <code>icon="bookmark-solid"</code>.</p>
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
					<tr>
						<td>
							<Button icon="view" />
						</td>
						<td>
							<Button icon="edit" />
						</td>
					</tr>
				</tbody>
			</table>

			<h2 id="buttons-primary">Primary Status (status="primary")</h2>
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

			<h2 id="buttons-destructive">Destructive Status (status="destructive")</h2>
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
						<td><Button status="destructive">Button</Button></td>
					</tr>
					<tr>
						<td>Hover</td>
						<td><Button status="destructive" className="is-hovering">Button</Button></td>
					</tr>
					<tr>
						<td>Active</td>
						<td><Button status="destructive" className="is-active">Button</Button></td>
					</tr>
					<tr>
						<td>Focused</td>
						<td><Button status="destructive" className="is-focused">Button</Button></td>
					</tr>
					<tr>
						<td>Disabled</td>
						<td><Button status="destructive" disabled>Button</Button></td>
					</tr>
				</tbody>
			</table>

			<h2 id="buttons-alert">Alert Status (status="alert")</h2>
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
						<td><Button status="alert">Button</Button></td>
					</tr>
					<tr>
						<td>Hover</td>
						<td><Button status="alert" className="is-hovering">Button</Button></td>
					</tr>
					<tr>
						<td>Active</td>
						<td><Button status="alert" className="is-active">Button</Button></td>
					</tr>
					<tr>
						<td>Focused</td>
						<td><Button status="alert" className="is-focused">Button</Button></td>
					</tr>
					<tr>
						<td>Disabled</td>
						<td><Button status="alert" disabled>Button</Button></td>
					</tr>
				</tbody>
			</table>

			<h2 id="buttons-sizes">Sizes</h2>
			<table>
				<tbody>
					<tr>
						<td>Small (size="sm")</td>
						<td>
							<Layout.Toolbar>
								<Button size="sm">Small Button</Button>
								<Button size="sm" icon="clone" />
								<Button size="sm" icon="reply" appearance="transparent" style={ { marginLeft: 'auto' } } />
								<Button size="sm" icon="approve" appearance="transparent" />
								<Button size="sm" icon="trash" appearance="transparent" status="destructive" />
								<Button size="sm" icon="ellipsis" appearance="transparent" />
							</Layout.Toolbar>
						</td>
					</tr>
					<tr>
						<td>Medium (default) - (size="med")</td>
						<td>
							<Layout.Toolbar>
								<Button size="med">Medium Button</Button>
								<Button size="med" icon="clone" />
								<Button icon="ellipsis" appearance="transparent" style={ { marginLeft: 'auto' } } />
								<Button size="med" icon="trash" status="destructive" appearance="transparent" />
							</Layout.Toolbar>
						</td>
					</tr>
					<tr>
						<td>Large (size="lg")</td>
						<td>
							<Layout.Toolbar>
								<Button size="lg">Large Button</Button>
								<Button size="lg" icon="clone" />
								<Button icon="trash" status="destructive" appearance="elevator" style={ { marginLeft: 'auto' } } />
							</Layout.Toolbar>
						</td>
					</tr>
				</tbody>
			</table>
		</Layout.ContentBoundary>
	)
}
