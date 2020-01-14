# Assistant Forms Documentation

- [Introduction](#introduction)
- [Form Hooks](#form-hooks)
	- [Tabs](#tabs)
	- [Sections](#sections)
	- [Fields](#fields)
- [Form Components](#form-components)

## Introduction
Assistant provides a number of components and hooks for creating forms. While forms can be created from scratch, it is recommended to use either the components or hooks to ensure consistent styling and functionality with other Assistant apps.

## Form Hooks
The form hooks provided by Assistant handle the majority of data processing and rendering for you. All you need to do is pass the relevant config and the hooks will pass back everything you need to take care of the rest.

Most of the time you will be using the `Form.useForm` hook which is a high level hook that makes use of the low level `Form.useFormData` hook and handles rendering for you. If you need to take care of the rendering yourself, use the low level hook instead.

The config object takes either `tabs`, `sections` or `fields` as properties, you cannot specify all three. If you need a tabbed form, use `tabs`. If you need a form with fields organized by sections, use `sections`. If you just need a simple form with a few fields, use `fields`. The config object also takes functions for `onSubmit`, `onChange`, and `onReset`.

Finally, the config object takes a `defaults` object that holds the key/value pairs for each of the form fields you have defined in your tabs, sections or fields config.

Below is an example showing the full config and object returned from the `Form.useForm` hook. For a more complete example used in a live app, please see `system/ui/pages/post/index.js`.

```
const {
	renderForm,
	resetForm,
	submitForm,
	fields,
	values,
	setValues,
	changed,
	hasChanges,
	isSubmitting,
	setIsSubmitting,
} = Form.useForm( {
	tabs: {},
	sections: {},
	fields: {},
	defaults: {},
	onChange: ( { key, value, setValue, state } ) => {},
	onSubmit: ( { values, changed, ids, setValue, setValues, state } ) => {},
	onReset: ( { values, changed, ids, setValue, setValues, state } ) => {},
	shouldHighlightChanges: true,
} )
```

Once you have called the hook, you can finish setting up your form as shown in the example below...

```
const Footer = () => {
	if ( ! hasChanges ) {
		return null
	}
	return (
		<Page.Toolbar>
			<Button onClick={ resetForm }>{ __( 'Cancel' ) }</Button>
			<Button type="submit" onClick={ submitForm } >{ __( 'Submit' ) }</Button>
		</Page.Toolbar>
	)
}

return (
	<Page title={ __( 'Example Form' ) } footer={ <Footer /> }>
		{ renderForm() }
	</Page>
)
```

The rest of this documentation will focus on the config passed to the hook.

### Tabs
Tabs allow you to create complex forms that are well organized. Each tab is also attached to a React Router path allowing the current state to be remembered between page views. Use the `path` prop for a tab to define the path and use the `exact` prop if the path must match the location exactly.

As shown in the example below, tab sections can also be defined using a callback function. This function should return the components for the tab sections and fields you'd like to render.

```
const { renderForm } = Form.useForm( {
	tabs: {
		exampleTab: {
			label: __( 'Example Tab' ),
			path: match.url,
			exact: true,
			isVisible: true,
			sections: {
				exampleSection: {
					label: __( 'Example Section' ),
					fields: {
						exampleField: {
							label: __( 'Example Field' ),
							component: 'text',
							onChange: ( { value } ) => {
								console.log( value )
							}
						},
					},
				},
				anotherSection: ( { fields } ) => {
					const { value, onChange } = fields.customField
					return (
						<Form.Section label={ __( 'Custom Section' ) }>
							<Form.Item label={ __( 'Custom Field' ) }>
								<input
									type="text"
									value={ value }
									onChange{ e => onChange( e.target.value ) }
								/>
							</Form.Item>
						</Form.Section>
					)
				},
			},
		},
		anotherTab: {
			...
		},
	},
	defaults: {
		exampleField: '',
		customField: '',
	},
	onSubmit: ( { values } ) => {
		// Send to the server here...
	},
} )
```

### Sections
Sections are setup the same way as shown in the tabs example above with a `label` and `fields` object for each section. The difference here is that we're only passing sections to the form hook. This approach can be used for simple forms or forms that only need one tab.

As shown in the example below, section fields can also be defined using a callback function. This function should return the components for the section fields you'd like to render.

```
const { renderForm } = Form.useForm( {
	sections: {
		exampleSection: {
			label: __( 'Example Section' ),
			isVisible: true,
			fields: {
				exampleField: {
					label: __( 'Example Field' ),
					component: 'text',
					onChange: ( { value } ) => {
						console.log( value )
					}
				},
			},
		},
		anotherSection: {
			fields: ( { fields } ) => {
				const { value, onChange } = fields.customField
				return (
					<Form.Item label={ __( 'Custom Field' ) }>
						<input
							type="text"
							value={ value }
							onChange{ e => onChange( e.target.value ) }
						/>
					</Form.Item>
				)
			},
		},
	},
	defaults: {
		exampleField: '',
		customField: '',
	},
} )
```

### Fields
For forms that don't need tabs or sections, you can pass the same object of fields that the tab and section examples above used. Each field has a standard set of props such as `label`, `isVisible`, and `isRequired` in addition to props specific to each field type. For a complete list of built-in field types and related props, please see `system/ui/forms/items`.

Additionally, each field must define a `component` that will be rendered. For built-in components, you can pass a string such as `text` or `select`. For custom components, you can pass a callback function to render your field as shown in the example below.

```
const { renderForm } = Form.useForm( {
	fields: {
		exampleField: {
			component: 'text',
			label: __( 'Example Field' ),
			labelPlacement: 'beside', // beside or above
			id: 'example',
			className: 'example',
			isVisible: true,
			isRequired: true,
			onChange: ( { value } ) => {}
		},
		customField: {
			component: ( { value, onChange } ) => {
				return (
					<Form.Item label={ __( 'Custom Field' ) }>
						<input
							type="text"
							value={ value }
							onChange{ e => onChange( e.target.value ) }
						/>
					</Form.Item>
				)
			}
		},
	},
	defaults: {
		exampleField: '',
		customField: '',
	},
	onSubmit: ( { values } ) => {
		// Send to the server here...
	},
} )
```

## Form Components
Forms can also be built from scratch using Assistant's form components. Those are primitive `<Form>`, `<Form.Section>`, and `<Form.Item>` components as shown in the example below.

Additionally, there are a number of built-in field components that can be found under `system/ui/forms/items` and accessed on the `Form` object such as `Form.TextItem` or `Form.SelectItem`.

```
import { Form } from 'ui'

const MyForm = () => {
	return (
		<Form>
			<Form.Section label={ __( 'Example Section' ) }>
				<Form.Item label={ __( 'Example Field' ) }>
					<input type="text" />
				</Form.Item>
			</Form.Section>
		</Form>
	)
}
```
