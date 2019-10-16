<?php

namespace FL\Assistant\System\Contracts;

abstract class TransformerAbstract {

	public function transform_array( $array ) {
		$transformed = [];

		foreach ( $array as $item ) {
			$transformed[] = $this( $item );
		}

		return $transformed;
	}
}
