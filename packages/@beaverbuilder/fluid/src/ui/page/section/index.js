import classname from 'classnames'
import './style.scss'

const Section = ( {
	children,
	className,
	label,
	handle,
	contentStyle = {},
	...rest
} ) => {
	const classes = classname( {
		'fluid-section': true,
		[`${handle}-section`]: handle,
	}, className )

	return (
		<div className={ classes } { ...rest }>
			{ label && <div className="fluid-section-title"><span className="fluid-section-title-text">{label}</span></div> }
			<div className="fluid-section-content" style={ contentStyle }>{children}</div>
		</div>
	)
}

export default Section
