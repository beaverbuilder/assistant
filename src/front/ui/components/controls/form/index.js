import React, { Fragment } from 'react'
import { Icon } from 'components'
import './style.scss'

export const FormTest = () => {
	return (
		<Fragment>
			<form>

				<div>
					<label htmlFor="name">Name <abbr title="required"><Icon name="asterisk" /></abbr></label>
					<input
						id="name"
						type="text"
						required={true}
						placeholder="Type Something!"
					/>
				</div>

				<div>
					<label htmlFor="email">Email Address</label>
					<input
						id="email"
						type="email"
						placeholder="john@example.com"
					/>
				</div>

				<div>
					<label htmlFor="password">Enter New Password</label>
					<input
						id="password"
						name="password"
						type="password"
						placeholder="Password123:)"
					/>
				</div>

				<div>
					<label htmlFor="search">Search Me</label>
					<input
						id="search"
						name="search"
						type="search"
						placeholder="Enter Your Search"
					/>
				</div>

				<div>
					<label htmlFor="phone">Phone Number</label>
					<input
						id="phone"
						name="phone"
						type="tel"
						placeholder="(xxx) xxx-xxxx"
					/>
				</div>

				<div>
					<label htmlFor="url">Website Address (URL)</label>
					<input
						id="url"
						name="url"
						type="url"
						placeholder="https://www.yoursite.com"
					/>
				</div>

				<div>
					<label htmlFor="area">A text area</label>
					<textarea id="area" rows="5"></textarea>
				</div>

				<div>
					<label htmlFor="selector">Select Something! <abbr title="required"><Icon name="asterisk" /></abbr></label>
					<select id="selector" name="selector">
						<option>Select Me!</option>
					</select>
				</div>

				<div>
					<label htmlFor="multi-selector">Multiple Choice</label>
					<select id="multi-selector" name="multi-selector" multiple={true}>
						<option>Red</option>
						<option>Blue</option>
						<option>Green</option>
					</select>
				</div>

				<div>
					<label htmlFor="suggestions">Text Field with Suggestions</label>
					<input
						id="suggestions"
						name="suggestions"
						type="text"
						placeholder="Type for suggestions"
						list="mySuggestion"
					/>
					<datalist id="mySuggestion">
						<option>Apple</option>
						<option>Banana</option>
						<option>Blackberry</option>
						<option>Blueberry</option>
						<option>Lemon</option>
						<option>Lychee</option>
						<option>Peach</option>
						<option>Pear</option>
					</datalist>
				</div>

				<div>
					<label htmlFor="length">
                        Text field with min/max length
						<abbr title="required"><Icon name="asterisk" /></abbr>
					</label>
					<input
						type="text"
						required
						minLength="6"
						maxLength="24"
						id="length"
						name="length"
						placeholder="Between 6 and 24 characters"
					/>
				</div>

				<div>
					<label htmlFor="number">Number Field</label>
					<input
						type="number"
						id="number"
						name="number"
						min="0"
						max="500"
						step="10"
					/>
				</div>

				<div>
					<label htmlFor="range">Range Field</label>
					<input
						type="range"
						id="range"
						name="range"
						min="0"
						max="500"
						step="10"
					/>
				</div>

				<div>
					<label htmlFor="color">Color Field</label>
					<input
						type="color"
						id="color"
						name="color"
					/>
				</div>
			</form>
		</Fragment>
	)
}
