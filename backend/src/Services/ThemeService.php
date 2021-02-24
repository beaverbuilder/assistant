<?php

namespace FL\Assistant\Services;

class ThemeService {

	/**
	 * @return array
	 */
	public function get_current_theme_data() {
		return $this->get_theme_data();
	}

	/**
	 * @return array
	 */
	public function get_theme_data( $slug = '' ) {
		$theme = wp_get_theme( $slug );
		$template = $theme->get( 'Template' );

		$data = [
			'name' => $theme->get( 'Name' ),
			'description' => $theme->get( 'Description' ),
			'url' => $theme->get( 'ThemeURI' ),
			'author' => $theme->get( 'Author' ),
			'author_url' => $theme->get( 'AuthorURI' ),
			'slug' => $theme->get_stylesheet(),
			'parent' => $template ? $this->get_theme_data( $template ) : null
		];

		return $data;
	}
}
