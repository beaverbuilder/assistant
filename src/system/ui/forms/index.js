import React, { createContext } from 'react'
import classname from 'classnames'
import { useForm } from './use-form'
import { useFormData } from './use-form-data'
import { useFormState } from './use-form-state' // Deprecated
import { Section, Item, Footer } from './parts'
import { Test } from './tests'
import './style.scss'

import {
	ActionsItem,
	CheckboxItem,
	LabelsItem,
	PlainTextItem,
	SelectItem,
	SuggestItem,
	TaxonomyTermsItem,
	ParentTermItems,
	TextItem,
	TextareaItem,
	UrlItem
} from './items'

export const Form = ( {
	className,
	context = Form.defaults,
	onSubmit = e => e.preventDefault(),
	additionalClasses, /* used by form hook */
	...rest
} ) => {

	const classes = classname( {
		'fl-asst-form': true,
	}, className, additionalClasses )

	return (
		<Form.Context.Provider value={ context }>
			<form className={ classes } onSubmit={ onSubmit } { ...rest } />
		</Form.Context.Provider>
	)
}

/* ------ Form System Setup ------ */
Form.defaults = {}

Form.Context = createContext( Form.defaults )
Form.Context.displayName = 'Form.Context'

/* ------ Form Hooks ------ */
Form.useForm = useForm
Form.useFormData = useFormData
Form.useFormState = useFormState

/* ------ Form Part Components ------ */
Form.Section = Section
Form.Section.displayName = 'Form.Section'

Form.Item = Item
Form.Item.displayName = 'Form.Item'

Form.Footer = Footer
Form.Footer.displayName = 'Form.Footer'

Form.Section = Section
Form.Section.displayName = 'Form.Section'

/* ------ Form Item Components ------ */
Form.ActionsItem = ActionsItem
Form.ActionsItem.displayName = 'Form.ActionsItem'

Form.CheckboxItem = CheckboxItem
Form.CheckboxItem.displayName = 'Form.CheckboxItem'

Form.LabelsItem = LabelsItem
Form.LabelsItem.displayName = 'Form.LabelsItem'

Form.PlainTextItem = PlainTextItem
Form.PlainTextItem.displayName = 'Form.PlainTextItem'

Form.SelectItem = SelectItem
Form.SelectItem.displayName = 'Form.SelectItem'

Form.SuggestItem = SuggestItem
Form.SuggestItem.displayName = 'Form.SuggestItem'

Form.TaxonomyTermsItem = TaxonomyTermsItem
Form.TaxonomyTermsItem.displayName = 'Form.TaxonomyTermsItem'

Form.TextItem = TextItem
Form.TextItem.displayName = 'Form.TextItem'

Form.TextareaItem = TextareaItem
Form.TextareaItem.displayName = 'Form.TextareaItem'

Form.UrlItem = UrlItem
Form.UrlItem.displayName = 'Form.UrlItem'

Form.ParentTermItems = ParentTermItems
Form.ParentTermItems.displayName = 'Form.ParentTermItems'

/* ------ Form Testing Components ------ */
Form.Test = Test
Form.Test.displayName = 'Form.Test'
