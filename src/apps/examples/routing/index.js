import { __ } from '@wordpress/i18n'
import { getSystemActions } from 'store'
import { App, AppIcon } from './app'

const { registerApp } = getSystemActions()

registerApp( 'fl-example-routing', {
    label: __('Routing Example'),
    root: App,
    icon: AppIcon,
    accentColor: {
        color: '#00A681',
    },
})
