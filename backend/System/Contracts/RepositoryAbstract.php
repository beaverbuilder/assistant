<?php


namespace FL\Assistant\System\Contracts;



abstract class RepositoryAbstract {


	abstract public function find( $id , callable $transform = null );

	abstract public function findWhere( array $args = [] , callable $transform = null );

	abstract public function paginate( array $args = [], callable $transform = null  );

	abstract public function query( array $args = [] );




}
