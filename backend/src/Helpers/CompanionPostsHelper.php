<?php

namespace FL\Assistant\Helpers;

class CompanionPostsHelper {

	/**
	 * Meta key on a library post item that carries its companion posts as one
	 * JSON string. It is never stored on a local post.
	 */
	const META_KEY = '_fl_asst_companions';

	/**
	 * Returns the unique companion posts plugins declare for a post.
	 *
	 * @param \WP_Post|null $post
	 * @return \WP_Post[]
	 */
	public static function collect( $post ) {
		$declared   = apply_filters( 'fl_assistant_library_companion_posts', [], $post );
		$companions = [];

		if ( ! is_array( $declared ) ) {
			return [];
		}

		foreach ( $declared as $companion ) {
			if ( $companion instanceof \WP_Post ) {
				$companions[ $companion->ID ] = $companion;
			}
		}

		return array_values( $companions );
	}

	/**
	 * Encodes companion entries, each shaped like a library item's post data.
	 *
	 * @param array $entries
	 * @return string
	 */
	public static function encode( $entries ) {
		return wp_json_encode( $entries );
	}

	/**
	 * Reads the companions embedded in a fetched library item, as item-shaped objects.
	 *
	 * @param object $item
	 * @return object[]
	 */
	public static function read( $item ) {
		$key     = self::META_KEY;
		$raw     = isset( $item->data->meta->{$key}[0] ) ? $item->data->meta->{$key}[0] : '';
		$entries = is_string( $raw ) ? json_decode( $raw ) : null;
		$items   = [];

		if ( ! is_array( $entries ) ) {
			return [];
		}

		foreach ( $entries as $entry ) {
			if ( isset( $entry->post->post_type ) ) {
				$items[] = (object) [ 'data' => $entry ];
			}
		}

		return $items;
	}
}
