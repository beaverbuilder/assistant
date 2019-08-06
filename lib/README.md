# Assistant Plugin Backend

## Design Philosophy

### MicroKernel Architecture

Assistant uses a MicroKernel architecture.

> The Microkernel architectural pattern applies to software systems that must be able 
to adapt to changing system requirements. It separates a minimal functional core 
from extended functionality, feature specific subsystems, and customer-specific parts. 
> The microkernel also serves as a socket for plugging in these extensions and coordinating their collaboration

-- From an article on the subject here: 

https://viralpatel.net/blogs/microkernel-architecture-pattern-apply-software-systems/

The MicroKernel implementation in Assistant is heavily inspired by the Laravel and 
Symfony Frameworks and should look familiar to developers who have worked with these frameworks.

### SOLID Principles

The goal of SOLID design principles is to improve the reusability of code. 

They also aim to reduce the frequency with which you need to change a class. 

* S - Single-responsiblity principle
* O - Open-closed principle
* L - Liskov substitution principle
* I - Interface segregation principle
* D - Dependency Inversion Principle

A good intro to SOLID can be found here:

https://scotch.io/bar-talk/s-o-l-i-d-the-first-five-principles-of-object-oriented-design

## Plugin Structure

### Dependency Injection (IoC) Container

The DI container concept should be familiar to most PHP developers as it is a PSR standard, and
implemented in most modern PHP frameworks. 

For anyone unfamiliar:

> A Dependency Injection Container is an object that knows how to instantiate and configure objects. 

-- Fabien Potencier


Dependency injection supports SOLID goals by decoupling the creation and the usage of an object. 
That enables you to replace dependencies without changing the class that uses them. 
It also reduces the risk that you have to change a class just because one of its 
dependencies changed.

#### DI in Assistant

At the core of assistant is a *very* minimalist DI container.

It implements a global config and a rudimentary Service Locator pattern.

It does not yet provide auto-wiring like more advanced containers.

The container class is located at `FL\Assistant\Core\Container`

Some important methods in `Container` are illustrated as follows:
```php

use FL\Assistant\Core\Container;

$container = Container::instance();

/*
 * Configuration values
 */
 
$container->set('my_config_key', $my_config_value);
// later
$config_val = $container->get('my_config_key');
// or
$container->remove('my_config_key');

/*
 * Service locator 
 */
 
// register or replace existing service
$container->register_service('service_name', function(Container $container) {
    return new ServiceInstance($container);
});
 
// use service
$container->service('service_name')->service_instance_method();
 
// remove service
$container->unregister_service('service_name');

```

##### HasContainer Trait

Assistant uses the `FL\Assistant\Utils\HasContainer` trait in classes that require a reference to the container
at instanciation.

Since most top level classes in Assistant require access to the container, 
using this trait keeps our code DRY.

The `HasContainer` trait implements a default constructor that has the following signature

`public function __construct(Container $container)`

This trait also supplies a public method to access the container:

`$this->container()`


e.g.
```php
class MyClass {
  use HasContainer;
  
  public function do_something() {
    $container = $this->container();
  }
  
}

$container = Container::instance();
$myclass = new MyClass($container);

```
### Services

In Assistant any class that represents a data source or manages 
domain logic for a subsystem should be implemented as a service.

Examples of things considered to be datasources are:
* WordPress posts, terms, taxonomy, and users
* Code that communicates with 3rd party REST API's. e.g. mailchimp or twitter
* Any code that queries the database directly
* etc..

A service class is any PHP object registered to the container.  
Optionally a service can use `HasContainer`

e.g. 
```php
class IconService {
    use HasContainer;
    
    public function get_registered_icon_sets() {
    
        // get a config value from the container
        $icons_dir = $this->container()->get('icons_dir');
        
        return [
            // icon sets
        ];
    }
   
}

// in the register method of a provider
$container->register_service('icons', function(Container $container) {
    return new IconService($container);
});

// using the service
$icon_sets = $container->service('icons')->get_registered_icon_sets();

```

### Providers

The mechanism to bootstrap each subsystem is via **Providers**.

All providers must implement the `ProviderInterface`

```php
namespace FL\Assistant\Providers;

use FL\Assistant\Core\Container;

use FL\Assistant\Data\IconsData; // <-- datasource

class IconsProvider implements ProviderInterface {
    
    /**
    * Bootstrap your subsystem here
    */
    public function register(Container $container) {
        
        // Set some global configuration variables
        $container->set('icon_directory', FL_ASSISTANT_DIR . '/icons');
        
        // Register a service with the container
        $container->register_service('icons', function(Container $container) {
            return new IconData($container);
        });
        
        // register hooks
        add_action('enqueue_scripts', function() {
            // enqueue icon sets
        });
    }
}
```

Providers must be registered in `FL\Assistant\Plugin` like so.

```php

namespace FL\Assistant\Core;

use FL\Assistant\Providers\CloudProvider;
use FL\Assistant\Providers\PluginProvider;
use FL\Assistant\Providers\RestProvider;
use FL\Assistant\Providers\IconsProvider; // <-- our provider

/**
 * Class Plugin
 * @package FL\Assistant\Core
 */
class Plugin {
        
    	/**
    	 * Providers are registered in the order they are listed her
    	 * @var array
    	 */
    	protected static $providers = [
    		PluginProvider::class,
    		RestProvider::class,
    		CloudProvider::class,
    		IconProvider::class,  // <-- Our provider
    	];
    	
    	// ... etc
}
```

  
### REST Controllers 

The `Controllers` directory contains REST controllers.  

All Assistant REST Controllers should extend `FL\Assistant\Controllers\AssistantController`

All subclasses of `AssistantController` use the `HasContainer` trait and therefore
have access to the `$this->container()` method.

`AssistantController` also sets a default namespace and provides
a convenience function named `route` to automatically prefix the default namespace.
 
```php
namespace FL\Assistant\Controllers;

class HelloController extends AssistantController {
    
    public function register_routes() {
        
        $config =  [
            'callback' => [$this, 'say_hello']
        ]
        
        // Register routes like this
        register_rest_route($this->>namespace . '/sayhello, $config);
        
        // OR save some keystrokes
        $this->route('/sayhello', $config);
    }
    
    public function say_hello(\WP_REST_Request $request) {
    
        $hello_service = $this->container()->service('hello');
        $name = $request->param('name');
        
        $response = [ 
            'greeting' => $hello_service->greet($name);
        ];
        
        rest_ensure_response($response);
    }
}
```
Rest Controllers need to be registered in `FL\Assistant\Providers\RestProvider` like so:

```php
namespace FL\Assistant\Providers;

// use statements
// ... etc 

use FL\Assistant\Controllers\HelloController; // <-- our new controller!


/**
 * Class RestProvider
 * @package FL\Assistant\Providers
 */
class RestProvider implements ProviderInterface {

	/**
	 * Registered controllers
	 * @var array
	 */
	protected $controllers = [
		AttachmentsController::class,
		CommentsController::class,
		CountsController::class,
		NotificationsController::class,
		PostsController::class,
		TermsController::class,
		UpdatesController::class,
		UsersController::class,
		HelloController::class,  // <-- our new controller!
	];

    // ...etc
    
}
```


### Action and Filter Classes
  
  In this architecture developers can still register hooks the old fashioned way,
  however, in  many cases hook logic becomes complex enough to depend on 
  several other external classes or functions. 
  
  This ends up  polluting containing classes with unrelated methods, and in doing so,
  breaks the Single Responsibility Principle in SOLID. 
   
  PHP 5.6 introduces classes that can act as `Closure` via the `__invoke()` magic method.
  
  Closure classes provide developers with an advanced option that allows fully 
  abstracted and encapsulated callback logic.
  
  Optionally you can give your Action or Filter classes access to the container by using `HasContainer`
  
  e.g.
  
  ```php
  class SomeAction {
  
    use HasContainer;
      
    public function a_support_function() {
        // do stuff here
        
        // or access the container
        $this->container()->service('foo')->do_foo_things();
    } 
      
    public function __invoke(/* any args */) {
        $this->a_support_function();
        
        // do additional stuff here
    }
      
  }
  
  add_action('init', new SomeAction());
  ```


