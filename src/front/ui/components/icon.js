import React from 'react'

export const Icon = ( { name } ) => {
	switch ( name ) {
	case 'close':
		return (
			<svg width="14px" height="14px" viewBox="0 0 14 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g fill="currentColor" transform="translate(-407.000000, -25.000000)">
					<path d="M414,33.2071068 L408.658051,38.7071068 C408.278749,39.0976311 407.663779,39.0976311 407.284477,38.7071068 C406.905174,38.3165825 406.905174,37.6834175 407.284477,37.2928932 L412.425271,32 L407.284477,26.7071068 C406.905174,26.3165825 406.905174,25.6834175 407.284477,25.2928932 C407.663779,24.9023689 408.278749,24.9023689 408.658051,25.2928932 L414,30.7928932 L419.341949,25.2928932 C419.721251,24.9023689 420.336221,24.9023689 420.715523,25.2928932 C421.094826,25.6834175 421.094826,26.3165825 420.715523,26.7071068 L415.574729,32 L420.715523,37.2928932 C421.094826,37.6834175 421.094826,38.3165825 420.715523,38.7071068 C420.336221,39.0976311 419.721251,39.0976311 419.341949,38.7071068 L414,33.2071068 Z"></path>
				</g>
			</svg>
		)
	case 'more':
		return (
			<svg width="6px" height="19px" viewBox="0 0 6 19" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<path fill="currentColor" d="M3.25,13.5 C1.83246521,13.5 0.684326172,14.61875 0.684326172,16 C0.684326172,17.38125 1.83246521,18.5 3.25,18.5 C4.66753479,18.5 5.81567383,17.38125 5.81567383,16 C5.81567383,14.61875 4.66753479,13.5 3.25,13.5 Z"></path>
				<path fill="currentColor" d="M3.25,0 C1.83246521,0 0.684326172,1.11875 0.684326172,2.5 C0.684326172,3.88125 1.83246521,5 3.25,5 C4.66753479,5 5.81567383,3.88125 5.81567383,2.5 C5.81567383,1.11875 4.66753479,0 3.25,0 Z"></path>
				<path fill="currentColor" d="M3.25,6.75 C1.83246521,6.75 0.684326172,7.86875 0.684326172,9.25 C0.684326172,10.63125 1.83246521,11.75 3.25,11.75 C4.66753479,11.75 5.81567383,10.63125 5.81567383,9.25 C5.81567383,7.86875 4.66753479,6.75 3.25,6.75 Z"></path>
			</svg>
		)
	case 'red-dot':
		return (
			<svg width="5px" height="5px" viewBox="0 0 5 5" version="1.1">
				<circle fill="#E10000" cx="2.5" cy="2.5" r="2.5"></circle>
			</svg>
		)
	case 'small-spinner':
		return (
			<svg width="16px"  height="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style={ { background: 'none' } }>
				<circle cx="50" cy="50" fill="none" ng-attr-stroke="{{config.color}}" ng-attr-stroke-width="{{config.width}}" ng-attr-r="{{config.radius}}" ng-attr-stroke-dasharray="{{config.dasharray}}" stroke="#8a8a8a" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(299.801 50 50)">
					<animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform>
				</circle>
			</svg>
		)
	case 'star-outline':
		return (
			<svg width="18px" height="19px" viewBox="0 0 18 19" version="1.1" xmlns="http://www.w3.org/2000/svg" >
				<g transform="translate(-371.000000, -375.000000)">
					<polygon stroke="currentColor" strokeWidth="2" fill="transparent" points="380 389.466316 385.562 393 384.086 386.34 389 381.858947 382.529 381.281053 380 375 377.471 381.281053 371 381.858947 375.914 386.34 374.438 393"></polygon>
				</g>
			</svg>
		)
	case 'trigger-button':
		return (
			<svg width="29px" height="24px" viewBox="0 0 29 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g fill="transparent" transform="translate(-145.000000, -145.000000)" fillRule="nonzero" strokeWidth="2" stroke="currentColor">
					<circle cx="158.5" cy="155.5" r="5.5"></circle>
					<path d="M172.014075,163 L172.014075,148 C172.014075,146.895431 171.118644,146 170.014075,146 L148,146 C146.895431,146 146,146.895431 146,148 L146,165.010842 C146,166.115411 146.895431,167.010842 148,167.010842 L170.014075,167.010842 L162.5,159.5" strokeLinecap="round" strokeLinejoin="round"></path>
				</g>
			</svg>
		)
	case 'default-app':
		return (
			<svg width="29px" height="24px" viewBox="0 0 29 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g transform="translate(-103, -212)" fill="transparent" fillRule="nonzero" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					<path d="M119,213 L128,213 C129.104569,213 130,213.895431 130,215 L130,232 C130,233.104569 129.104569,234 128,234 C124.888889,234 122.555556,234 121,234 M116.011108,234 C114.168714,234 110.831678,234 106,234 C104.895431,234 104,233.104569 104,232 L104,215 C104,213.895431 104.895431,213 106,213 L114,213" ></path>
					<polyline points="121 234 110 223 114 219"></polyline>
					<polyline transform="translate(119.000000, 220.000000) rotate(-180.000000) translate(-119.000000, -220.000000) " points="124 227 114 217 118 213"></polyline>
					<circle cx="117" cy="223" r="1"></circle>
				</g>
			</svg>
		)
	case 'back':
		return (
			<svg width="9px" height="14px" viewBox="0 0 9 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<path stroke="currentColor" d="M0.292893219,1.70710678 C-0.0976310729,1.31658249 -0.0976310729,0.683417511 0.292893219,0.292893219 C0.683417511,-0.0976310729 1.31658249,-0.0976310729 1.70710678,0.292893219 L8.41421356,7 L1.70710678,13.7071068 C1.31658249,14.0976311 0.683417511,14.0976311 0.292893219,13.7071068 C-0.0976310729,13.3165825 -0.0976310729,12.6834175 0.292893219,12.2928932 L5.58578644,7 L0.292893219,1.70710678 Z" transform="translate(4.207107, 7.000000) scale(-1, 1) translate(-4.207107, -7.000000) "></path>
			</svg>
		)
	case 'forward':
		return (
			<svg width="9px" height="14px" viewBox="0 0 9 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<path stroke="currentColor" d="M0.292893219,1.70710678 C-0.0976310729,1.31658249 -0.0976310729,0.683417511 0.292893219,0.292893219 C0.683417511,-0.0976310729 1.31658249,-0.0976310729 1.70710678,0.292893219 L8.41421356,7 L1.70710678,13.7071068 C1.31658249,14.0976311 0.683417511,14.0976311 0.292893219,13.7071068 C-0.0976310729,13.3165825 -0.0976310729,12.6834175 0.292893219,12.2928932 L5.58578644,7 L0.292893219,1.70710678 Z" transform="translate(4.207107, 7.000000) translate(-4.207107, -7.000000) "></path>
			</svg>
		)
	default:
		return (
			<svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<g fill="currentColor" transform="translate(-54.000000, -186.000000)">
					<path d="M62,200 L64,200 L64,198 L62,198 L62,200 Z M63,186 C58.032,186 54,190.032 54,195 C54,199.968 58.032,204 63,204 C67.968,204 72,199.968 72,195 C72,190.032 67.968,186 63,186 Z M63,202 C59.14125,202 56,198.85875 56,195 C56,191.14125 59.14125,188 63,188 C66.85875,188 70,191.14125 70,195 C70,198.85875 66.85875,202 63,202 Z M63,190 C61.3425,190 60,191.392222 60,193.111111 L61.5,193.111111 C61.5,192.255556 62.175,191.555556 63,191.555556 C63.825,191.555556 64.5,192.255556 64.5,193.111111 C64.5,194.666667 62.25,194.472222 62.25,197 L63.75,197 C63.75,195.25 66,195.055556 66,193.111111 C66,191.392222 64.6575,190 63,190 Z"></path>
				</g>
			</svg>
		)
	}
}
