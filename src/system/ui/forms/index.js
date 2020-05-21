import React, { createContext } from 'react'
import classname from 'classnames'
import { useForm } from './use-form'
import { useFormData } from './use-form-data'
import { Section, Item, Footer, Input } from './parts'
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
	UrlItem,
	ImageItem,
	ButtonItem,
	CalenderItem
} from './items'

export const Form = ( {
	className,
	context = Form.defaults,
	onSubmit = e => e.preventDefault(),
	additionalClasses, /* used by form hook */
	...rest
} ) => {

	const classes = classname( 'fl-asst-form', className, additionalClasses )
	return (
		<Form.Context.Provider value={ context }>
			<form className={ classes } onSubmit={ onSubmit } { ...rest } />
		</Form.Context.Provider>
	)
}

/* ------ Form System Setup ------ */

Form.Context = createContext( {} )
Form.Context.displayName = 'Form.Context'

/* ------ Form Hooks ------ */
Form.useForm = useForm
Form.useFormData = useFormData

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

Form.ImageItem = ImageItem
Form.ImageItem.displayName = 'Form.ImageItem'

Form.ButtonItem = ButtonItem
Form.ButtonItem.displayName = 'Form.ButtonItem'

Form.CalenderItem = CalenderItem
Form.CalenderItem.displayName = 'Form.CalenderItem'

Form.Input = Input
Form.Input.displayName = 'Form.Input'
