<?php


namespace FL\Assistant\System;

/**
 * Class View
 * @package FL\Assistant\Util
 *
 * @phpcs:disable WordPress.PHP.DontExtract.extract_extract
 */
class View {

	/**
	 * @var string path to template dir
	 */
	protected $template_dir;

	public function __construct( $template_dir ) {
		$this->template_dir = $template_dir;

	}

	/**
	 * @param string $template_dir
	 *
	 * @return $this
	 */
	public function set_template_dir( $template_dir ) {
		$this->template_dir = $template_dir;

		return $this;
	}

	/**
	 * @return string path
	 */
	public function get_template_dir() {
		return $this->template_dir;
	}


	/**
	 * Render template to string
	 *
	 * @param $template_name
	 * @param array $data
	 *
	 * @return false|string
	 */
	public function render_to_string( $template_name, array $data = [] ) {

		error_reporting( 'E_ALL' );

		 $path = sprintf( '%s/%s.php', $this->template_dir, $template_name );

		ob_start();

		extract( $data );

		include( $path );

		$output = ob_get_clean();
		return $output;
	}

	/**
	 * Render template to echo
	 *
	 * @param $template_name
	 * @param array $data
	 */
	public function render( $template_name, array $data = [] ) {
		echo $this->render_to_string( $template_name, $data );
	}
}
