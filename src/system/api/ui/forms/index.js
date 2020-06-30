import React from 'react'
import classname from 'classnames'
import { useForm } from './use-form'
import Form from '@beaverbuilder/forms'
import '@beaverbuilder/forms/dist/index.css'

import {
	ActionsItem,
	CheckboxItem,
	DateTimeItem,
	FileItem,
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

/* ------ Form Hooks ------ */
Form.useForm = useForm

/* ------ Form Item Components ------ */
Form.ActionsItem = ActionsItem
Form.ActionsItem.displayName = 'Form.ActionsItem'

Form.CheckboxItem = CheckboxItem
Form.CheckboxItem.displayName = 'Form.CheckboxItem'

Form.DateTimeItem = DateTimeItem
Form.DateTimeItem.displayName = 'Form.DateTimeItem'

Form.FileItem = FileItem
Form.FileItem.displayName = 'Form.FileItem'

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

export { Form }
