import { __ } from '@wordpress/i18n'
import { registerApp } from 'assistant'
import { App, AppIcon } from './app'

registerApp( 'fl-example-routing', {
    label: __('Routing Example'),
    root: App,
    icon: AppIcon,
    accentColor: {
        color: '#00A681',
    },
})
