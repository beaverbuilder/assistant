import React, { useState } from 'react'
import Dialog from '../base'

export const useDialog = ( options ) => {
	const [ isShowing, setIsShowing ] = useState( false )

	const showDialog = () => {
		setIsShowing( true )
	}

	const DialogComponent = () => {
		return (
			<Dialog
				isShowing={ isShowing }
				setIsShowing={ setIsShowing }
				{ ...options }
			/>
		)
	}

	return [ showDialog, DialogComponent ]
}

export const useAlert = ( options ) => {
	options.buttons = [
		{
			label: 'Ok',
			isSelected: true,
			onClick: ( { closeDialog } ) => closeDialog(),
		}
	]

	return useDialog( options )
}

export const useConfirm = ( {
	onCancel = () => {},
	onConfirm = () => {},
	...options
} ) => {
	options.buttons = [
		{
			label: 'Cancel',
			onClick: ( { closeDialog } ) => {
				closeDialog()
				onCancel()
			},
		},
		{
			label: 'Ok',
			isSelected: true,
			onClick: ( { closeDialog } ) => {
				closeDialog()
				onConfirm()
			},
		}
	]

	return useDialog( options )
}
