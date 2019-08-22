import React, {useEffect, useState} from 'fl-react'
import {Page, Form} from 'assistant/lib'
import {__} from "@wordpress/i18n";
import {isEmpty} from 'lodash'

export const GeneralTab = (props) => {

    const publicDisplayOptions = (user) => {
        const options = {}

        options.nickname = user.nickname
        options.username = user.username

        if (!isEmpty(user.firstName)) {
            options.firstname = user.firstName
        }

        if (!isEmpty(user.lastName)) {
            options.lastname = user.lastName
        }

        if (!isEmpty(user.firstName) && !isEmpty(user.lastName)) {
            options.firstlast = `${user.firstName} ${user.lastName}`
            options.lastfirst = `${user.lastName} ${user.firstName}`
        }

        if (!isEmpty(user.displayName)) {
            options.displayname = user.displayName
        }

        return options
    }

    const onFormChange = () => {

    }

    const [values, setValue] = Form.useFormState(props.user, onFormChange)

    return (
        <Form>
            <Form.Section label={__('General')}>
                <Form.Item label={__('First Name')} labelFor="firstName" isRequired={true} placement="beside">
                    <input
                        id="firstName"
                        type="text"
                        required={true}
                        placeholder={__('First Name')}
                        // value={  }
                        // onChange={ e => setValue( 'title', e.target.value ) }
                    />
                </Form.Item>
                <Form.Item label={__('Last Name')} labelFor="lastName" isRequired={true} placement="beside">
                    <input
                        id="lastName"
                        type="text"
                        required={true}
                        placeholder={__('Last Name')}
                        // value={  }
                        // onChange={ e => setValue( 'title', e.target.value ) }
                    />
                </Form.Item>
                <Form.Item label={__('Nickname')} labelFor="nickname" isRequired={true} placement="beside">
                    <input
                        id="nickname"
                        type="text"
                        required={true}
                        placeholder={__('Nickname')}
                        // value={  }
                        // onChange={ e => setValue( 'title', e.target.value ) }
                    />
                </Form.Item>
            </Form.Section>
        </Form>
    )
}
