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

> A Dependency Injection Container is an object that knows how to instantiate and configure objects. 

-- Fabien Potencier


Dependency injection supports SOLID goals by decoupling the creation of the usage of an object. 
That enables you to replace dependencies without changing the class that uses them. 
It also reduces the risk that you have to change a class just because one of its 
dependencies changed.

At the core of assistant is a *very* minimalist DI container in

`FL\Assistant\Core\Container`

Some important methods in `Container` are illustrated as follows:
```php

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

#### HasContainer Trait

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
  
      
  In many cases hook logic becomes complex enough to depend on 
  several other external classes or functions. This ends up 
  polluting containing classes with unrelated methods.  
  This breaks the Single Responsibility Principle in SOLID. 
   
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

  
