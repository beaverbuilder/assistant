import React from 'react'
import { __ } from '@wordpress/i18n'
import { Icon } from 'components'
import './style.scss'

export const CreatePost = () => {
	return (
		<form>
			<div>
				<label htmlFor="fl-asst-post-title">{__( 'Title' )} <abbr title="required"><Icon name="asterisk" /></abbr></label>
				<input
					id="fl-asst-post-title"
					name="fl-asst-post-title"
					type="text"
					placeholder={__( 'Title Your Post Something Great!' )}
				/>
			</div>

			<div>
				<label htmlFor="fl-asst-post-type">{__( 'Post Type' )}</label>
				<select id="fl-asst-post-type" name="fl-asst-post-type">
					<optgroup label={__( 'Built-in Types' )}>
						<option value="post">{__( 'Post' )}</option>
						<option value="page">{__( 'Page' )}</option>
					</optgroup>
					<optgroup label={__( 'Additional Types' )}>
						<option value="whatever">{__( 'Squirrel' )}</option>
					</optgroup>
				</select>
			</div>

			<div>
				<label htmlFor="fl-asst-post-slug">{__( 'Slug' )}</label>
				<input
					id="fl-asst-post-slug"
					name="fl-asst-post-slug"
					type="text"
					placeholder={__( 'my-great-post-slug' )}
				/>
			</div>
		</form>
	)
}
