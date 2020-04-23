import { __ } from '@wordpress/i18n'
import { Icon } from 'assistant/ui'
import { getCardsActions } from './data'

const { registerCardType } = getCardsActions()

const registerDefaultCardTypes = () => {

    registerCardType( 'fl-shortcuts', {
        label: __( 'Shortcuts' ),
        icon: Icon.Placeholder,
        render: () => <div>Render</div>,
        edit: () => <div>Edit</div>,
    })

    registerCardType( 'fl-apps', {
        label: __( 'Apps' ),
        icon: Icon.Apps,
        render: () => <div>Render</div>,
        edit: () => <div>Edit</div>,
    })

    registerCardType( 'fl-labels', {
        label: __( 'Labels' ),
        render: () => <div>Render</div>,
        edit: () => <div>Edit</div>,
    })

}

registerDefaultCardTypes()
