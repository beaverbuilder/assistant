import classname from 'classnames'
import { Layout } from '../../'
import './style.scss'

const Section = ( {
	children,
	className,
	label,
	handle,
	contentStyle = {},
	padX = true,
	padY = true,
	footer,
	...rest
} ) => {

	const classes = classname( {
		'fluid-section': true,
		[`${handle}-section`]: handle,
	}, className )

	return (
		<div className={ classes } { ...rest }>
			{ label && <div className="fluid-section-title"><span className="fluid-section-title-text">{label}</span></div> }
			<Layout.Box
				className="fluid-section-content"
				padX={padX}
				padY={padY}
				style={ contentStyle }
			>{children}</Layout.Box>
			{ footer && (
				<Layout.Box
					padY={false}
					className="fluid-section-footer"
				>{footer}</Layout.Box>
			)}
		</div>
	)
}

export default Section
