<?php

namespace FL\Assistant\Services;

class ThemeService {

	/**
	 * @return array
	 */
	public function get_current_theme_data() {
		$theme = wp_get_theme();

		$data = [
			'name' => $theme->get( 'Name' ),
			'description' => $theme->get( 'Description' ),
			'url' => $theme->get( 'ThemeURI' ),
			'author' => $theme->get( 'Author' ),
			'author_url' => $theme->get( 'AuthorURI' ),
			'slug' => get_stylesheet(),
			'parent_slug' => get_template(),
			'is_child' => is_child_theme()
		];

		return $data;
	}
}
