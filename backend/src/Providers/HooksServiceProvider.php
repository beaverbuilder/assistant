<?php


namespace FL\Assistant\Providers;


use FL\Assistant\Hooks\Actions\OnEditUserProfile;
use FL\Assistant\Hooks\Actions\OnEnqueueScripts;
use FL\Assistant\Hooks\Actions\OnPersonalOptionsUpdate;
use FL\Assistant\Hooks\Actions\OnWPBeforeAdminBarRender;
use FL\Assistant\Hooks\Actions\OnBeforeDeletePost;
use FL\Assistant\Hooks\Actions\OnDeleteTerm;
use FL\Assistant\Hooks\Filters\OnHeartbeatReceived;
use FL\Assistant\Hooks\Filters\OnFLBuilderUIBarButtons;
use FL\Assistant\System\Contracts\ServiceProviderAbstract;
use FL\Assistant\Data\Transformers\NotationsTransformer;
use FL\Assistant\Data\Repository\NotationsRepository;
use FL\Assistant\Data\Repository\LabelsRepository;
use FL\Assistant\Data\Transformers\LabelsTransformer;

class HooksServiceProvider extends ServiceProviderAbstract {

	/**
	 * @throws \FL\Assistant\System\Container\InjectionException
	 */
	public function bootstrap() {

		register_activation_hook(
			FL_ASSISTANT_FILE, function () {
				do_action( 'fl_assistant_activate' );
			}
		);

		$this->actions();
		$this->filters();
	}

	public function actions() {

		// Enqueue Assistant frontend
		$enqueue_scripts = $this->injector->make( OnEnqueueScripts::class );
		add_action( 'wp_enqueue_scripts', $enqueue_scripts );
		add_action( 'admin_enqueue_scripts', $enqueue_scripts );

		// setup user profile meta fields - shows on YOUR profile, not on others.
		add_action( 'show_user_profile', $this->injector->make( OnEditUserProfile::class ) );
		add_action( 'personal_options_update', $this->injector->make( OnPersonalOptionsUpdate::class ) );

		// Add Assistant Toolbar Item
		add_action( 'wp_before_admin_bar_render', $this->injector->make( OnWPBeforeAdminBarRender::class ) );

		// post actions
		add_action( 'before_delete_post', $this->injector->make( OnBeforeDeletePost::class ) );

		// taxonomy actions
		add_action( 'delete_term', $this->injector->make( OnDeleteTerm::class ) );

	}

	public function filters() {

		// setup heartbeat
		add_filter( 'heartbeat_received', $this->injector->make( OnHeartbeatReceived::class ), 11, 2 );

		add_filter( 'fl_builder_ui_bar_buttons', $this->injector->make( OnFLBuilderUIBarButtons::class ) );

		// Setup custom WP admin post list columns
		$this->enqueue_custom_admin_columns();
	}

	public function enqueue_custom_admin_columns() {

		$types = get_post_types( [ 'public' => true, ], 'objects' );

		foreach( $types as $type => $info ) {
			add_filter( "manage_{$type}_posts_columns", [$this, 'add_columns'] );
			add_action( "manage_{$type}_posts_custom_column", [ $this, 'render_column' ], 10, 2 );
		}
	}

	public function add_columns( $columns ) {
		$columns['fl_assistant'] = __( 'Assistant', 'fl-assistant' );
		return $columns;
	}

	public function render_column( $column, $post_id ) {
		$vars = "--fl-asst-red: #FF5335; --fl-asst-blue: #1BADF8; --fl-asst-green: #00D281; --fl-asst-yellow: #FFD000; --fl-asst-orange: #FF9500; --fl-asst-purple: #CC73E1; --fl-asst-pink: #FF2968;";
		$styles = "{$vars} padding: 2px 5px; display: inline-flex; flex: 0 0 auto; border-radius: 20px; border: 1px solid #d2d2d2; align-items: center; color: black; background: white; margin: 2px 5px 3px; margin-left:0;";
		$dot = "width: 10px; height: 10px; flex: 0 0 10px; border-radius: 7px; background: blue; margin-right: 5px;";

		if ( 'fl_assistant' === $column ) {
			$transformer = new NotationsTransformer;
			$repository = new NotationsRepository( $transformer );
			$labels = $repository->get_labels( 'post', $post_id );

			$labels_repo = new LabelsRepository;
			$labels_transformer = new LabelsTransformer( $labels_repo );
			$terms = $labels_repo->query( [ 'hide_empty' => false ] )->get_terms();

			// Assemble term meta dataset
			$term_meta = [];
			foreach( $terms as $key => $term ) {
				$item = call_user_func( $labels_transformer, $term );
				$term_meta[ $item['id'] ] = $item;
			}

			// Output labels
			foreach( $labels as $label ) {
				$term = $term_meta[ $label['label_id'] ];
				if ( isset( $term ) ) {
					print "<span style='{$styles}'><span style='{$dot}; background-color: {$term['color']}'></span>{$term['label']}</span>";
				}
			}
		}
	}
}
