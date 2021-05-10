import Dialog from './dialog'
import { useDialog, useAlert, useConfirm } from './hooks'

Dialog.useDialog = useDialog
Dialog.useAlert = useAlert
Dialog.useConfirm = useConfirm

export default Dialog
