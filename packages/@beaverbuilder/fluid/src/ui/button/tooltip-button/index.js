import { forwardRef } from 'react'
import { ToggleLayer, useHover, Arrow } from 'react-laag'
import { useFocus } from '../../../utils'
import Button from '../base'

const TooltipButton = forwardRef( ( props, ref ) => {
    const [isHovering, hoverProps] = useHover({
        delayEnter: 500,
        delayLeave: 0
    })
    const [isFocused, focusProps] = useFocus()

	const { title, ...rest } = props

	if ( title ) {
		return (
            <ToggleLayer
                isOpen={ isHovering || isFocused }
                placement={{
                    possibleAnchors: [
                        "TOP_CENTER",
                        "LEFT_CENTER",
                        "BOTTOM_CENTER",
                        "RIGHT_CENTER"
                    ],
                    anchor: "BOTTOM_CENTER",
                    autoAdjust: true,
                    triggerOffset: 9,
                }}
                renderLayer={ ({ layerProps, isOpen, layerSide, arrowStyle }) => {
                    return isOpen && (
                        <div
                            ref={layerProps.ref}
                            style={{
                                ...layerProps.style,
                                background: 'var(--fluid-box-color)',
                                color: 'var(--fluid-box-background)',
                                padding: '5px 10px',
                                fontSize: 12,
                                borderRadius: 3,
                                zIndex: 99999999999999, /* wow */
                                pointerEvents: 'none',

                            }}
                        >
                            <Arrow
                            style={arrowStyle}
                            layerSide={layerSide}
                            size={6}
                            angle={45}
                            roundness={1}
                            borderWidth={1}
                            borderColor="var(--fluid-box-color)"
                            backgroundColor="var(--fluid-box-color)"
                            />
                            <span>{title}</span>
                        </div>

                    )
                }}
            >
            {({ triggerRef }) => (
                <Button
                    ref={triggerRef}
                    {...hoverProps}
                    {...focusProps}
                    {...rest}
                />
            )}
            </ToggleLayer>
        )
	}

	return (
		<Button ref={ref} {...props} />
	)
} )

export default TooltipButton
