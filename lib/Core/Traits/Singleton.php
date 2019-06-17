<?php
namespace FL\Assistant\Core\Traits;

/**
 * Trait Singleton
 * @package FL\Assistant\Core\Traits
 */
trait Singleton {
	/**
	 * @var \Singleton
	 */
	private static $instance;

	/**
	 * @return Singleton
	 */
	public static function instance() {
		if (!(self::$instance instanceof self)) {
			self::$instance = new self;
		}
		return self::$instance;
	}
}
