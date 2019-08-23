<?php


namespace FL\Assistant\Util;


class View {

	protected $template_dir;

	public function __construct( $template_dir ) {
		$this->template_dir = $template_dir;
	}

	public function set_template_dir( $template_dir ) {
		$this->template_dir = $template_dir;

		return $this;
	}

	public function get_template_dir() {
		return $this->template_dir;
	}


	public function render_to_string( $template_name, array $data = [] ) {
		$path = sprintf( "%s/%s.php", $this->template_dir, $template_name );

		ob_start();
		extract( $data );
		include( $path );
		$output = ob_get_clean();

		return $output;
	}

	public function render( $template_name, array $data = [] ) {
		echo $this->render_to_string( $template_name, $data );
	}
}
