import TooltipButton from './tooltip-button'
import { withWarning } from '../../utils'
import './style.scss'

const Button = TooltipButton
Button.displayName = 'Button'

Button.Test = withWarning(Button, 'there is a problem here')

export default Button
