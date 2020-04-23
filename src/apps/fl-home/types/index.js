import { __ } from '@wordpress/i18n'
import { Icon } from 'assistant/ui'
import { getCardsActions } from '../data'
import Shortcuts from './shortcuts'
import Query from './query'

const { registerCardType } = getCardsActions()

const registerDefaultCardTypes = () => {

    registerCardType( 'fl-query', {
        label: __( 'Query' ),
        render: Query,
        edit: Query.Edit,
        contentProps: {
            style: {
                 padding: 0
            }
        }
    })

    registerCardType( 'fl-shortcuts', {
        label: __( 'Shortcuts' ),
        icon: Icon.Link,
        render: Shortcuts,
        edit: Shortcuts.Edit,
        contentProps: {
            style: {
                 padding: 'var(--fluid-sm-space)'
            }
        }
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
