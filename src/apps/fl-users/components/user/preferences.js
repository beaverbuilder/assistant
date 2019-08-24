import React, {useEffect, useState} from 'fl-react'
import {Page, Form} from 'assistant/lib'
import {__} from "@wordpress/i18n";

export const PreferencesTab = (props) => {
    return (
        <Form>
            <Form.Section label={__('Preferences')}>
            </Form.Section>
            <Form.Section label={__('Other Tab')}>
            </Form.Section>
        </Form>
    )
}
