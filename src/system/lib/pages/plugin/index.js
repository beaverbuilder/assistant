import React from 'fl-react'
import { __ } from '@wordpress/i18n'
import { Page, Form } from 'lib'

export const Plugin = ( { location = {} } ) => {

	const defaultItem = {
		author: null,
		banner: null,
		content: null,
		key: null,
		meta: null,
		metaUpdated: null,
		plugin: null,
		thumbnail: null,
		title: null,
		type: 'plugin',
		version: null,
	}

	const item = 'undefined' !== typeof location.state.item ? { ...defaultItem, ...location.state.item } : defaultItem

	const { banner, title, content, version, author } = item

	const contentHTML = { __html: content }

	return (
		<Page shouldPadSides={ false } title={__('Plugin')}>
			{ banner && <img src={ banner } /> }

            <Form>
                <Form.Section>
                    <Form.Item>
                        <h1>{title}</h1>
                        <div dangerouslySetInnerHTML={ contentHTML } />
                    </Form.Item>
                </Form.Section>
                <Form.Section label={__('Details')}>
                    <Form.Item label={__('Version')} placement="beside">{version}</Form.Item>
                    <Form.Item label={__('Author')} placement="beside">{author}</Form.Item>
                </Form.Section>
            </Form>
		</Page>
	)
}
