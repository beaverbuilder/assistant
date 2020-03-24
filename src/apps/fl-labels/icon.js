import React from 'react'

const LabelsIcon = ( { context } ) => {

	if ( 'sidebar' === context ) {
		return (
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M11.0192 2.5858L17.838 9.40466C18.6191 10.1857 18.6191 11.452 17.838 12.2331L12.2331 17.8381C11.452 18.6191 10.1857 18.6191 9.40463 17.8381L2.58577 11.0192C2.2107 10.6441 1.99999 10.1354 1.99999 9.605L1.99999 3.00001C1.99999 2.44773 2.4477 2.00001 2.99999 2.00001L9.60497 2.00001C10.1354 2.00001 10.6441 2.21073 11.0192 2.5858Z" stroke="currentColor" strokeWidth="2" fill="none" />
				<circle cx="6.5" cy="6.5" r="1.5" fill="currentColor" />
			</svg>
		)
	}

	return (
		<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="7.5" cy="26.5" r="6.25" stroke="#F8D247" strokeWidth="2.5"/>
			<circle cx="26.5" cy="26.5" r="6.25" stroke="#EB426A" strokeWidth="2.5"/>
			<circle cx="7.5" cy="7.5" r="6.25" stroke="#5FCF88" strokeWidth="2.5"/>
			<circle cx="26.5" cy="7.5" r="6.25" stroke="#51ABF2" strokeWidth="2.5"/>
		</svg>
	)
}

export default LabelsIcon
