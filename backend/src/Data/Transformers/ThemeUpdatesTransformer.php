<?php


namespace FL\Assistant\Data\Transformers;


class ThemeUpdatesTransformer {

	public function __invoke( \WP_Theme $theme ) {

		$update = $theme->update;

		$thumbnail = null;
		if ( isset( $update->icons ) ) {
			if ( isset( $update->icons['2x'] ) ) {
				$thumbnail = $update->icons['2x'];
			} elseif ( isset( $update->icons['1x'] ) ) {
				$thumbnail = $update->icons['1x'];
			}
		}
		return [
			'author'         => strip_tags( $theme->Author ),
			'banner'         => $theme->get_screenshot(),
			'content'        => $theme->Description,
			'id'             => $update['theme'],
			'meta'           => $theme->Version . ' by ' . strip_tags( $theme->Author ),
			'meta_updated'   => $update['new_version'] . ' by ' . strip_tags( $theme->Author ),
			'theme'          => $update['theme'],
			'thumbnail'      => $theme->get_screenshot(),
			'title'          => $theme->Name,
			'type'           => 'theme',
			'version'        => $theme->Version,
			'updatedVersion' => $update['new_version'],
		];
	}
}
