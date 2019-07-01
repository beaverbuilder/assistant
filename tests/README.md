### WordPress Unit Tests

Running phpunit tests for Assistant requires Composer.

https://getcomposer.org

Steps: 

1. Create an empty test database

    `mysqladmin -u root -p create wptests`
    
2. Install the WordPress unit testing framework

    `bin/install-wp-tests.sh <test_db_name> <test_db_user> <test_db_pass>`
    
3. Install composer dependencies

    `composer install`

4. Run tests

    For automated test runners: 
    
    `vendor/bin/phpunit`
    
    For user friendly console output use the `--testdox` flag:
    
    `vendor/bin/phpunit --testdox`

    On the console you should see output that looks like this:

```
Installing...
Running as single site... To run multisite, use -c tests/phpunit/multisite.xml
Not running ajax tests. To execute these, use --group ajax.
Not running ms-files tests. To execute these, use --group ms-files.
Not running external-http tests. To execute these, use --group external-http.
PHPUnit 7.0.0 by Sebastian Bergmann and contributors.

FL\Assistant\Tests\Unit\Core\Container
 ✔ create instance
 ✔ can create service
 ✔ can get set config keys

FL\Assistant\Tests\Unit\Data\PostData
 ✔ can create
 ✔ get stati
 ✔ get types
 ✔ get taxonomies

FL\Assistant\Tests\Unit\Data\UserData
 ✔ create
 ✔ get current
 ✔ find
 ✔ get roles
 ✔ counts by user role

FL\Assistant\Tests\Rest\UsersController
 ✔ can get users
 ✔ editor cannot list users

Time: 4.69 seconds, Memory: 36.00 MB

OK (14 tests, 16 assertions)

```
