<?php

namespace FL\Assistant\Hooks;

use FL\Assistant\Clients\Cloud\CloudClient;

class CustomizerPreview {

	protected $data;
	protected $uuid;

	public function __construct() {
		add_action( 'init', [ $this, 'init' ] );
	}

	public function init() {
		if ( ! current_user_can( 'edit_others_posts' ) ) {
			return false;
		}

		if ( isset( $_GET['fl-asst-customizer-preview-init'] ) ) {
			$this->load_data();
			$this->create_changeset();
			$this->redirect_to_changeset();
		}

		if ( isset( $_GET['fl-asst-customizer-preview'] ) ) {
			add_action( 'customize_controls_print_styles', [ $this, 'print_styles' ] );
		}
	}

	public function load_data() {
		$item_id = absint( $_GET['fl-asst-customizer-preview-init'] );

		if ( $item_id ) {
			$client = new CloudClient;
			$item = $client->libraries->get_item( $item_id );

			if ( $item && $item->data ) {
				$this->data = $item->data;
			}
		}
	}

	public function create_changeset() {
		if ( $this->data ) {
			$this->uuid = wp_generate_uuid4();
			wp_insert_post( [
				'post_type' => 'customize_changeset',
				'post_status' => 'auto-draft',
				'post_author' => get_current_user_id(),
				'post_name' => $this->uuid,
				'post_content' => $this->create_changeset_content(),
				'meta_input' => [
					'_customize_restore_dismissed' => 1
				]
			] );
		}
	}

	public function redirect_to_changeset() {
		if ( $this->data && $this->uuid ) {
			$args = [
				'changeset_uuid' => $this->uuid,
				'fl-asst-customizer-preview' => 1
			];
			wp_redirect( add_query_arg( $args, admin_url( 'customize.php' ) ) );
			die();
		}
	}

	public function create_changeset_content() {
		$theme = $this->data->theme;
		$mods = $this->data->mods;
		$current_mods = get_theme_mods();
		$user_id = get_current_user_id();
		$content = [];

		foreach ( $mods as $key => $value ) {
			if ( isset( $current_mods[ $key ] ) && $value === $current_mods[ $key ] ) {
				continue;
			}
			$content[ "{$theme->slug}::{$key}" ] = [
				'value' => wp_slash( $value ),
				'type' => 'theme_mod',
				'user_id' => $user_id,
				'date_modified_gmt' => date( 'Y-m-d h:i:s' )
			];
		}

		return json_encode( $content, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT );
	}

	public function print_styles() {
		echo '<style>';
		echo '.wp-customizer .wp-full-overlay { margin: 0 !important; }';
		echo '.wp-customizer #customize-controls { display: none !important; }';
		echo '</style>';
	}
}
