<?php


namespace FL\Assistant\Providers;


use FL\Assistant\Data\Transformers\PluginUpdatesTransformer;
use FL\Assistant\Data\Transformers\TermsTransformer;
use FL\Assistant\Data\Repository\AttachmentsRepository;
use FL\Assistant\Data\Repository\CommentsRepository;
use FL\Assistant\Data\Repository\LabelsRepository;
use FL\Assistant\Data\Repository\NotationsRepository;
use FL\Assistant\Data\Repository\PostsRepository;
use FL\Assistant\Data\Repository\TermsRepository;
use FL\Assistant\Data\Repository\UsersRepository;
use FL\Assistant\Data\Site;
use FL\Assistant\Data\Transformers\AttachmentTransformer;
use FL\Assistant\Data\Transformers\CommentTransformer;
use FL\Assistant\Data\Transformers\PostTransformer;
use FL\Assistant\Data\Transformers\ThemeUpdatesTransformer;
use FL\Assistant\Data\Transformers\UserTransformer;
use FL\Assistant\System\Contracts\ServiceProviderAbstract;
use FL\Assistant\System\Integrations\BeaverBuilder;

/**
 * Class DataServiceProvider
 * @package FL\Assistant\Providers\
 */
class DataServiceProvider extends ServiceProviderAbstract {

	protected $repository = [
		UsersRepository::class,
		PostsRepository::class,
		AttachmentsRepository::class,
		CommentsRepository::class,
		TermsRepository::class,
		NotationsRepository::class,
		LabelsRepository::class,
	];

	protected $transformers = [
		UserTransformer::class,
		PostTransformer::class,
		AttachmentTransformer::class,
		TermsTransformer::class,
		CommentTransformer::class,
		PluginUpdatesTransformer::class,
		ThemeUpdatesTransformer::class,
	];

	/**
	 * Inject all data sources
	 * @throws \FL\Assistant\System\Container\InjectionException
	 */
	public function bootstrap() {
		// data
		$this->injector->define( Site::class, [] );
		// integrations
		$this->injector->define( BeaverBuilder::class, [] );

		$this->register_repositories();
		$this->register_transformers();

	}

	public function register_repositories() {
		foreach ( $this->repository as $repository_name ) {
			$this->injector->define( $repository_name, [] );
		}
	}

	public function register_transformers() {
		foreach ( $this->transformers as $transformer_class ) {
			$this->injector->define( $transformer_class, [] );
		}
	}
}
