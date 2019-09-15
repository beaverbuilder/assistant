<?php


namespace FL\Assistant\Providers;


use FL\Assistant\Data\Notations;
use FL\Assistant\Data\Posts;
use FL\Assistant\Data\Site;
use FL\Assistant\Data\Users;
use FL\Assistant\Helpers\PaginationHelper;
use FL\Assistant\RestApi\Transformers\PostTransformer;
use FL\Assistant\RestApi\Transformers\UserTransformer;
use FL\Assistant\System\Contracts\ProviderAbstract;
use FL\Assistant\System\Integrations\BeaverBuilder;


/**
 * Class DataProvider
 * @package FL\Assistant\Providers\
 */
class DataProvider extends ProviderAbstract {

	/**
	 * Inject all data sources
	 */
	public function bootstrap() {

		// data
		$this->injector->define( Users::class, [] );
		$this->injector->define( Posts::class, [
			PaginationHelper::class, PostTransformer::class
		] );

		$this->injector->define( Site::class, [] );
		$this->injector->define( Notations::class, [] );


		// integrations
		$this->injector->define( BeaverBuilder::class, [] );

		// transformers
		$this->injector->define( PostTransformer::class, [
			Posts::class,
			Notations::class,
			BeaverBuilder::class
		] );

		$this->injector->define( UserTransformer::class, [] );
	}
}
