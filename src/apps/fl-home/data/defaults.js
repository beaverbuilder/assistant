import { __ } from '@wordpress/i18n'
import { Icon } from 'assistant/ui'

export const defaultPageKey = 'home'

export const defaultPage = {
    label: __( 'Home' ),
    isEditable: true,
    cards: [
        {
            id: 'lksjdlfkjsdf',
            type: 'fl-shortcuts',
        },
        {
            id: '98372934729',
            type: 'fl-query',
        },
        {
            id: '092u30909',
            type: 'fl-apps',
        },
        {
            id: 'sfsdfsdf',
            type: 'fl-labels',
        },
    ],
}


export const defaultCard = {
    title: null,
    content: null,
    type: defaultCardTypeKey,
}

export const defaultCardTypeKey = 'fl-card'

export const defaultCardType = {
    label: __('Generic Card'),
    allowMultiple: true,
    icon: Icon.Placeholder,
    edit: () => null,
    render: () => null,
}
