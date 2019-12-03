import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page } from 'fluid/ui'
import { Form, Nav } from 'assistant/ui'

export const App = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route path={ `${match.url}/` } component={ Main } />
	</Nav.Switch>
)

const Main = ( { match } ) => {
	const tabs = {
		tabOne: {
			label: __( 'Tab One' ),
			path: match.url,
			exact: true,
			sections: {
				sectionOne: {
					label: __( 'Section One' ),
					fields: {
						fieldOne: {
							label: __( 'Field One' ),
							component: Form.TextItem,
						}
					},
				},
				sectionTwo: {
					label: __( 'Section Two' ),
					fields: {
						fieldTwo: {
							label: __( 'Field Two' ),
							labelPlacement: 'beside',
							component: Form.SelectItem,
							options: {
								'test-1': __( 'Test 1' ),
								'test-2': __( 'Test 2' ),
								'test-3': __( 'Test 3' ),
							},
							onChange: ( { value } ) => {
								console.log( value )
							}
						}
					},
				},
			},
		},
		tabTwo: {
			label: __( 'Tab Two' ),
			path: `${ match.url }/tab-two`,
			sections: {
				sectionThree: {
					label: __( 'Section Three' ),
					fields: {
						fieldThree: {
							label: __( 'Field Three' ),
							component: Form.TextItem,
						}
					},
				},
			},
		},
	}

	const sections = {
		sectionOne: {
			label: __( 'Section One' ),
			fields: {
				fieldOne: {
					label: __( 'Field One' ),
					component: Form.TextItem,
				}
			},
		},
		sectionTwo: {
			label: __( 'Section Two' ),
			fields: {
				fieldTwo: {
					label: __( 'Field Two' ),
					labelPlacement: 'beside',
					component: Form.SelectItem,
					options: {
						'test-1': __( 'Test 1' ),
						'test-2': __( 'Test 2' ),
						'test-3': __( 'Test 3' ),
					},
					onChange: ( { value } ) => {
						console.log( value )
					}
				},
				fieldThree: {
					label: __( 'Field Three' ),
					component: Form.TextItem,
				}
			},
		},
	}

	const fields = {
		fieldOne: {
			label: __( 'Field One' ),
			component: Form.TextItem,
		},
		fieldTwo: {
			label: __( 'Field Two' ),
			labelPlacement: 'beside',
			component: Form.SelectItem,
			options: {
				'test-1': __( 'Test 1' ),
				'test-2': __( 'Test 2' ),
				'test-3': __( 'Test 3' ),
			},
			onChange: ( { value } ) => {
				console.log( value )
			}
		},
		fieldThree: {
			label: __( 'Field Three' ),
			component: Form.TextItem,
		}
	}

	const defaults = {
		fieldOne: '',
		fieldTwo: '',
		fieldThree: '',
	}

	const {
		FormContent,
		resetForm,
		submitForm,
		values,
		hasChanges,
		isSubmitting,
		setIsSubmitting,
	} = Form.useForm( {
		//tabs,
		//sections,
		fields,
		defaults,
	} )

	return <FormContent />
}
