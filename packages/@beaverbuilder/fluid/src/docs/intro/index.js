import React from 'react'
import * as Text from '../../text'

export default () => {
	return (
		<Text.ContentArea>
			<h1>FLUID Design Language</h1>
			<p>Fluid is a library of styles and react components that establishes a visual environment for creating a variety of different UI experiences.</p>

			<h2>Size Variables</h2>
			<p>In order to acheive consistent spacing across apps, there are 3 primary space variables</p>
			<table>
				<tbody>
					<tr>
						<td>--fluid-sm-space</td>
						<td>5px</td>
						<td>The space surrounding most controls and between buttons</td>
					</tr>
					<tr>
						<td>--fluid-med-space</td>
						<td>10px</td>
						<td>Helpful for separating pieces of inner content</td>
					</tr>
					<tr>
						<td>--fluid-lg-space</td>
						<td>20px</td>
						<td>Typically used for outer margins and deep spacing</td>
					</tr>
				</tbody>
			</table>

		</Text.ContentArea>
	)
}
