import { __ } from '@wordpress/i18n'
import { Icon } from 'assistant/ui'

export const defaultPageKey = 'home'

export const defaultPage = {
    label: __( 'Home' ),
    isEditable: true,
    cards: [
        {
            id: '232flksjdflk',
            title: __('My First Card'),
            content: "Hi my name is brent",
            type: defaultCardTypeKey,
        },
        {
            id: 'lksjdlfkjsdf',
            title: __('My Second Card'),
            content: "This is some dummie content",
            type: defaultCardTypeKey,
        },
        {
            id: '092u30909',
            title: __('My Third Card'),
            content: "Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Donec sed odio dui. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam quis risus eget urna mollis ornare vel eu leo.",
            type: defaultCardTypeKey,
        }
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
