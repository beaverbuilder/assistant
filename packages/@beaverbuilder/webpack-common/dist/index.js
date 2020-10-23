
module.exports = class FLCommonEnvironment {
	constructor( options ) {
		this.options = options
	}
	apply( compiler ) {
		compiler.hooks.entryOption.tap( 'FLCommonEnvironment', ( context, entry ) => {

			
		} )
	}
}
