<?php

namespace FL\Assistant\Hooks;

use FL\Assistant\Clients\Cloud\CloudClient;

class CustomizerPreview {

	protected $item;
	protected $uuid;

	public function __construct() {
		add_action( 'init', [ $this, 'init' ] );
	}

	public function init() {
		if ( ! current_user_can( 'edit_others_posts' ) ) {
			return false;
		}

		if ( isset( $_GET['fl-asst-customizer-preview-init'] ) ) {
			$this->load_item();
			$this->load_changeset();
			$this->redirect_to_changeset();
		}

		if ( isset( $_GET['fl-asst-customizer-preview'] ) ) {
			add_action( 'customize_controls_print_styles', [ $this, 'print_styles' ] );
		}
	}

	public function load_item() {
		$item_id = absint( $_GET['fl-asst-customizer-preview-init'] );

		if ( $item_id ) {
			$client = new CloudClient;
			$item = $client->libraries->get_item( $item_id );

			if ( $item ) {
				$this->item = $item;
			}
		}
	}

	public function load_changeset() {
		if ( $this->item ) {
			$posts = get_posts( [
				'post_type' => 'customize_changeset',
				'post_status' => 'auto-draft',
				'meta_key' => 'fl_asst_changeset_item_id',
				'meta_value' => $this->item->id,
			] );

			if ( count( $posts ) ) {
				$this->uuid = $posts[0]->post_name;
				$this->update_changeset( $posts[0]->ID );
			} else {
				$this->create_changeset();
			}
		}
	}

	public function update_changeset( $post_id ) {
		if ( $this->item ) {
			wp_update_post( [
				'ID' => $post_id,
				'post_content' => $this->create_changeset_content(),
			] );
		}
	}

	public function create_changeset() {
		if ( $this->item ) {
			$this->uuid = wp_generate_uuid4();
			wp_insert_post( [
				'post_type' => 'customize_changeset',
				'post_status' => 'auto-draft',
				'post_author' => get_current_user_id(),
				'post_name' => $this->uuid,
				'post_content' => $this->create_changeset_content(),
				'meta_input' => [
					'fl_asst_changeset_item_id' => $this->item->id,
					'_customize_restore_dismissed' => 1,
				]
			] );
		}
	}

	public function create_changeset_content() {
		$theme = $this->item->data->theme;
		$mods = $this->item->data->mods;
		$current_mods = get_theme_mods();
		$slug = get_stylesheet();
		$user_id = get_current_user_id();
		$content = [];

		foreach ( $mods as $key => $value ) {
			if ( isset( $current_mods[ $key ] ) && $value === $current_mods[ $key ] ) {
				continue;
			}
			$content[ "{$slug}::{$key}" ] = [
				'value' => wp_slash( $value ),
				'type' => 'theme_mod',
				'user_id' => $user_id,
				'date_modified_gmt' => date( 'Y-m-d h:i:s' )
			];
		}

		return json_encode( $content, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT );
	}

	public function redirect_to_changeset() {
		if ( $this->item && $this->uuid ) {
			$args = [
				'changeset_uuid' => $this->uuid,
				'fl-asst-customizer-preview' => 1
			];
			wp_redirect( add_query_arg( $args, admin_url( 'customize.php' ) ) );
			die();
		}
	}

	public function print_styles() {
		echo '<style>';
		echo '.wp-customizer .wp-full-overlay { margin: 0 !important; }';
		echo '.wp-customizer #customize-controls { display: none !important; }';
		echo '</style>';
	}
}