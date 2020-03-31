<?php


namespace FL\Assistant\Data\Transformers;


class PluginUpdatesTransformer {

	public function __invoke( \stdClass $plugin ) {
		$update = $plugin->update;
		$thumbnail = null;
		$banner = null;

		if ( isset( $update->icons ) ) {
			if ( isset( $update->icons['2x'] ) ) {
				$thumbnail = $update->icons['2x'];
			} elseif ( isset( $update->icons['1x'] ) ) {
				$thumbnail = $update->icons['1x'];
			}
		}

		if ( isset( $update->banners ) ) {
			$update->banners = (array) $update->banners;

			if ( isset( $update->banners['2x'] ) ) {
				$banner = $update->banners['2x'];
			} elseif ( isset( $update->banners['1x'] ) ) {
				$banner = $update->banners['1x'];
			}
		}

		return [
			'author'         => $plugin->AuthorName,
			'authorURI'      => $plugin->AuthorURI,
			'banner'         => $banner,
			'bannerSizes'    => $update->banners,
			'content'        => $plugin->Description,
			'id'             => $update->plugin,
			'meta'           => $plugin->Version . ' by ' . $plugin->AuthorName,
			'metaUpdated'    => $update->new_version . ' by ' . $plugin->AuthorName,
			'plugin'         => $update->plugin,
			'thumbnail'      => $thumbnail,
			'thumbnailSizes' => $update->icons,
			'title'          => $plugin->Name,
			'type'           => 'plugin',
			'version'        => $plugin->Version,
			'updatedVersion' => $update->new_version,
			'tested'         => $update->tested,
			'requiresPHP'    => $update->requires_php,
			'pluginURI'      => $plugin->PluginURI,
		];
	}
}
