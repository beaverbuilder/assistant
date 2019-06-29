<?php


namespace FL\Assistant\Data\Models;


trait HasEntityAttributes {

	protected $data = [];

	public function fill( array $data = [] ) {
		$this->data = array_merge( $this->data, $data );
		return $this;
	}

	public function __get($key) {
		if(isset($this->data[$key])) {
			return $this->data[$key];
		}

		return null;
	}

	public function __set( $key, $value ) {
		$this->data[$key] = $value;
		return $this;
	}

	public function __isset( $key ) {
		return isset($this->data[$key]);
	}

	public function __unset( $key ) {
		unset($this->data[$key]);
	}

	public function toArray() {
		return $this->data;
	}

	public function toJson() {
		return json_encode($this->data);
	}
}
