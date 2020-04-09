import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from 'assistant/hooks'
import { getSystemConfig } from 'assistant/data'

const { integrations } = getSystemConfig()

const integrationEnabled = () => applyFilters( 'enable-default-integration', true, 'yoast-seo' )

addFilter( 'post-tabs', 'fl-assistant', ( tabs, { baseURL } ) => {

	// Allow default integration to be overridden
	if (
		! integrationEnabled() ||
        ! integrations.yoastSEO.isActive
	) {
		return tabs
	}

	// Construct additional tab for the useForm() system
	tabs.seo = {
		label: __( 'SEO' ),
		path: baseURL + '/seo',
		sections: {
			basic: {
				fields: {
					keyphrase: {
						label: __( 'Focus Keyphrase' ),
						component: 'text',
					},
					cornerstone_content: {
						label: __( 'Cornerstone Content' ),
						component: 'checkbox',
						labelPlacement: 'beside',
					}
				}
			}
		}
	}

	return tabs
} )
