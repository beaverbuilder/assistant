import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Button, Form, Layout, Page } from 'assistant/ui'
import cloud from 'assistant/cloud'
import { getWpRest } from 'assistant/utils/wordpress'
import { getSystemConfig } from 'assistant/data'

export default ({ item, setItem }) => {
	const { id, itemId } = useParams()

	const tabs = [
		{
			handle: 'settings',
			label: __('Settings'),
			path: `/fl-cloud/libraries/${id}/items/${itemId}`,
			component: () => <ItemSettings item={item} setItem={setItem} />,
			exact: true
		},
		{
			handle: 'import',
			label: __('Import'),
			path: `/fl-cloud/libraries/${id}/items/${itemId}/import`,
			component: () => <ItemImport item={item} setItem={setItem} />
		}
	]

	return (
		<>
			<Layout.Box padX={ false }>
				<Layout.Tabs tabs={ tabs } />
			</Layout.Box>
			<Layout.Box padY={ false }>
				<Layout.CurrentTab tabs={ tabs } />
			</Layout.Box>
		</>
	)
}

const ItemSettings = ({ item, setItem }) => {

	const fields = {
		post_title: {
			label: __('Title'),
			component: 'text',
			alwaysCommit: true,
			value:item.data.post.post_title,
			validate: (value, errors) => {
				if ('' === value) {
					errors.push(__('Please enter a title.'))
				}
			}
		},
		post_name: {
			label: __('Slug'),
			component: 'text',
			alwaysCommit: true,
			value:item.data.post.post_name,
			validate: (value, errors) => {
				if ('' === value) {
					errors.push(__('Please enter a slug.'))
				}
			}
		}
	}

	const onSubmit = ({ values, setErrors }) => {
		const requestData = {
			name: values.post_title,
			data: {
				...item.data,
				...values
			}
		}
		return cloud.libraries
			.updateItem(item.id, requestData)
			.then(response => {
				setItem(response.data)
			})
			.catch(error => {
				setErrors(error.response.data.errors)
			})
	}

	const { renderForm, submitForm, isSubmitting } = Form.useForm({
		fields,
		onSubmit,
		defaults: item.data
	})

	return (
		<>
			{renderForm()}
			<Button.Loading onClick={submitForm} isLoading={isSubmitting}>
				{__('Update Item')}
			</Button.Loading>
		</>
	)
}

const ItemImport = ({ item, setItem }) => {
	const { contentTypes } = getSystemConfig()
	const wpRest = getWpRest()
	const [type, setType] = useState(null)
	const [posts, setPosts] = useState(null)
	const [post, setPost] = useState(null)
	const [loading, setLoading] = useState(false)
	const [postData, setpostData] = useState(null)
	const [overrideData, setoverrideData] = useState(null)
	const getPostLabels = () => {
		if (type) {
			return contentTypes[type].labels
		}
		return {
			singular: __('Post'),
			plural: __('Posts')
		}
	}

	const fields = {
		type: {
			label: __('Post Type'),
			component: 'select',
			alwaysCommit: true,
			isLoading: loading,
			options: () => {
				const options = {
					0: __('Choose...'),
					post: __('Post'),
					page: __('Page')
				}
				return options
			},
			onChange: ({ value }) => {
				setType(null)
				setPosts(null)
				if ('0' !== value) {
					const data = {
						post_type: value,
						orderby: 'title',
						order: 'ASC',
						posts_per_page: -1
					}
					setType(value)
					setLoading(true)
					wpRest
						.posts()
						.findWhere(data)
						.then(response => {
							setPosts(response.data.items)
							setLoading(false)
						})
				}
			},
			validate: (value, errors) => {
				if (!value || 'choose' === value) {
					errors.push(__('Please choose a post type.'))
				}
			}
		},
		slug: {
			label: getPostLabels().singular,
			component: 'select',
			alwaysCommit: true,
			isVisible: !!posts,
			options: () => {
				const options = {
					0: __('Choose...')
				}
				if (posts && posts.length) {
					posts.map(post => (options[post.id] = post.title))
				}
				return options
			},
			onChange: ({ value }) => {
				setPost(null)
				if ('0' !== value) {
					setPost(value)
				}
			},
			validate: (value, errors) => {
				if (!value || 'choose' === value) {
					errors.push(__('Please choose an item.'))
				}
			}
		},
		override: {
			label: 'Override Items',
			component: 'select',
			alwaysCommit: true,
			isVisible: !!post,
			options: () => {
				const options = {
					0: __('Choose...'),
					1: __('Content & Terms'),
					2: __('Content Only'),
					3: __('Terms Only')
				}
				return options
			},
			onChange: ({ value }) => {
				setoverrideData(null)
				if ('0' !== value) {
					setoverrideData(value)
				}
			},
			validate: (value, errors) => {
				if (!value || 'choose' === value) {
					errors.push(__('Please choose an item to override.'))
				}
			}
		}
	}

	const onSubmit = ({ values, setErrors }) => {
		if (confirm(__('Are you sure want to override?'))) {
			wpRest
				.posts()
				.syncFromLib(post, item.id, overrideData)
				.then(response => {
					console.log(response)
				})
				.catch(error => {
					setErrors(error.response.data.errors)
				})
		}
	}

	const { renderForm, submitForm, isSubmitting } = Form.useForm({
		fields,
		onSubmit
	})

	const importFromLibrary = () => {
		const wpRest = getWpRest()
		wpRest
			.posts()
			.importFromLibrary(item.id)
			.then(response => {
				if (response.data.success) {
					alert(__('Post Imported Successfully'))
				}
			})
	}
	return (
		<>
			<Page.Section label={__('Importing Posts')}>
				<div>
					Clicking import should import the post into the site just like a
					standard WordPress import. A few things to keep in mind...
				</div>
				<div>1. The status of imported posts should be draft.</div>
				<div>2. The author should be the current user.</div>
				<div>3. Give options to import meta and terms.</div>
				<br />
				<Button onClick={importFromLibrary}>{__('Import to Site')}</Button>
			</Page.Section>

			<Page.Section label={__('Overriding Posts')}>
				<div>
					Clicking override should override the current post you are viewing
					with the library post...
				</div>
				<div>1. Give options to override content, meta and terms.</div>
				<br />
				{renderForm()}
				<Button isLoading={isSubmitting} onClick={submitForm}>
					{__('Override')}
				</Button>
			</Page.Section>
		</>
	)
}
