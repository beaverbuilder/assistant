import React, {useEffect, useState} from 'fl-react'
import {Page, Form} from 'assistant/lib'
import {__} from "@wordpress/i18n";

export const PostsTab = (props) => {
    return (
        <Form>
            <Form.Section label={__('Posts')}>
                <h3>This user's posts</h3>
            </Form.Section>
        </Form>
    )
}
