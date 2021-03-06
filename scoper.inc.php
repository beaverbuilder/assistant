<?php

declare(strict_types=1);

use Isolated\Symfony\Component\Finder\Finder;

return [
	// The prefix configuration. If a non null value will be used, a random prefix will be generated.
	'prefix' => "FL\Assistant\Vendor",

	// By default when running php-scoper add-prefix, it will prefix all relevant code found in the current working
	// directory. You can however define which files should be scoped by defining a collection of Finders in the
	// following configuration key.
	//
	// For more see: https://github.com/humbug/php-scoper#finders-and-paths
	'finders' => [
		Finder::create()->files()->in('vendor'),
		Finder::create()
			->files()
			->ignoreVCS(true)
			->notName('/LICENSE|.*\\.md|.*\\.dist|Makefile|composer\\.json|composer\\.lock/')
			->exclude([
				'doc',
				'test',
				'test_old',
				'tests',
				'Tests',
				'vendor-bin',
			])
			->in('./vendor'),
		Finder::create()->append([
			'./composer.json',
		]),
	]
];


