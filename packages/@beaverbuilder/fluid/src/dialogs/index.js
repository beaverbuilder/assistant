import Dialog from './dialog'
import DialogRoot from './root'
import { useDialog, useAlert, useConfirm } from './hooks'

Dialog.DialogRoot = DialogRoot
Dialog.useDialog = useDialog
Dialog.useAlert = useAlert
Dialog.useConfirm = useConfirm

export default Dialog
