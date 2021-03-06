::: v-pre

# Laravel Valet

- [Introducción](#introduction)
    - [Valet o Homestead](#valet-or-homestead)
- [Instalación](#installation)
    - [Actualización](#upgrading)
- [Activar sitios](#serving-sites)
    - [El comando "Park"](#the-park-command)
    - [El comando "Link"](#the-link-command)
    - [Asegurar sitios con TLS](#securing-sites)
- [Compartir sitios](#sharing-sites)
- [Variables de entorno específicas del sitio](#site-specific-environment-variables)
- [Drivers de Valet personalizados](#custom-valet-drivers)
    - [Drivers locales](#local-drivers)
- [Otros comandos de Valet](#other-valet-commands)
- [Archivos y directorios de Valet](#valet-directories-and-files)

<a name="introduction"></a>
## Introducción

Valet es un entorno de desarrollo de Laravel para Mac. No requiere de Vagrant ni de modificar el archivo de configuración `/etc/hosts`. Incluso permite compartir tus sitios a través de túneles locales. _Genial ¿Verdad?_

Laravel Valet configura tu Mac para que siempre inicie el servicio de [Nginx](https://www.nginx.com/) en segundo plano al iniciar tu computadora. Después, [DnsMasq](https://en.wikipedia.org/wiki/Dnsmasq) actuará como servidor proxy, procesando todas las peticiones en el dominio `*.test` apuntando a los sitios instalados en tu computadora local.

En otras palabras, es un entorno de desarrollo de Laravel sorprendentemente rápido y solamente utiliza cerca de 7MB de RAM. Laravel Valet no está pensado para ser un reemplazo de Vagrant y Homestead, en su lugar presenta una alternativa flexible y rápida, lo cual es una buena opción para quienes tengan una cantidad limitada de RAM.

Por defecto, Valet brinda soporte para las siguientes tecnologías, pero no está limitado a sólo ellas:

- [Laravel](https://laravel.com)
- [Lumen](https://lumen.laravel.com)
- [Bedrock](https://roots.io/bedrock/)
- [CakePHP 3](https://cakephp.org)
- [Concrete5](https://www.concrete5.org/)
- [Contao](https://contao.org/en/)
- [Craft](https://craftcms.com)
- [Drupal](https://www.drupal.org/)
- [Jigsaw](https://jigsaw.tighten.co)
- [Joomla](https://www.joomla.org/)
- [Katana](https://github.com/themsaid/katana)
- [Kirby](https://getkirby.com/)
- [Magento](https://magento.com/)
- [OctoberCMS](https://octobercms.com/)
- [Sculpin](https://sculpin.io/)
- [Slim](https://www.slimframework.com)
- [Statamic](https://statamic.com)
- Static HTML
- [Symfony](https://symfony.com)
- [WordPress](https://wordpress.org)
- [Zend](https://framework.zend.com)

Además, es posible extender Valet con tu propio [driver personalizado](#custom-valet-drivers).

<a name="valet-or-homestead"></a>
### Valet o Homestead

Como sabrás, Laravel ofrece [Homestead](/homestead.html), otro entorno de desarrollo local de Laravel. Homestead y Valet difieren en cuanto a la audiencia a la que están pensados y su aproximación al desarrollo local. Homestead ofrece toda una máquina virtual de Ubuntu con Nginx instalado y configurado. Homestead es una muy buena elección si deseas tener un entorno de desarrollo virtualizado de Linux o si te encuentras trabajando con Windows / Linux.

Por otro lado, Valet solamente es soportado por Mac y requiere que instales PHP y un servidor de base de datos directamente en tu equipo local. Esto puede lograrse fácilmente haciendo uso de [Homebrew](https://brew.sh) con comandos como `brew install php` y `brew install mysql`. Valet proporciona un entorno de desarrollo local bastante rápido haciendo un uso mínimo de consumo de recursos, lo cual es genial para desarrolladores que solamente requieran de PHP / MySQL y no necesiten de todo un entorno virtualizado de desarrollo.

Tanto Valet como Homestead son buenas elecciones para configurar tu entorno de desarrollo de Laravel. El que sea que vayas a elegir depende completamente de tu gusto personal o las necesidades de tu equipo.

<a name="installation"></a>
## Instalación

**Valet requiere de macOS y [Homebrew](https://brew.sh). Antes de comenzar, asegurate de que ningún otro programa como Apache o Nginx esté utilizando el puerto 80 de tu computadora.**

- Instala o actualiza [Homebrew](https://brew.sh/) a su última versión con `brew update`.
- Instala PHP 7.4 usando Homebrew con `brew install homebrew/php/php`.
- Instala [Composer](https://getcomposer.org).
- Instala Valet por medio de Composer con `composer global require laravel/valet`. Asegúrate de que el directorio `~/.composer/vendor/bin` se encuentre en el "PATH" de tu sistema.
- Ejecuta el comando `valet install`. Esto va a configurar e instalar Valet y DnsMasq y va a registrar el daemon de Valet para que se inicie junto con el sistema operativo.

Una vez que Valet haya sido instalado, trata de hacer ping a cualquier dominio `*.test` desde tu terminal usando un comando como `ping foobar.test`. Si Valet ha sido instalado correctamente deberás ver una respuesta de ese dominio en la dirección `127.0.0.1`.

Valet iniciará automaticamente su daemon cada vez que el sistema inicie. Por lo tanto, si Valet se instaló adecuadamente, no hay necesidad de volver a ejecutar el comando `valet start` o `valet install`.

#### Utilizar otro dominio

Por defecto, Valet actuará como servidor de tus proyectos usando el TLD `.test`. Si lo prefieres, puedes cambiar este dominio por otro de tu elección utilizando el comando `valet tld dominio`.

Por ejemplo, si deseas utilizar el dominio `.app` en lugar de `.test`, ejecuta desde la terminal el comando `valet tld app` y Valet ahora funcionará como servidor de tus proyectos pero ahora con el dominio `*.app`.

#### Base de datos

Si necesitas de una base de datos, puedes instalar MySQL ejecutando el comando `brew install mysql@5.7` desde la terminal. Una vez que haya sido instalado, necesitarás iniciar el servicio de manera manual con el comando `brew services start mysql@5.7`. Podrás conectarte a tu base de datos en `127.0.0.1` utilizando el usuario `root` sin ninguna contraseña.

#### Versiones de PHP

Valet te permite cambiar entre versiones de PHP usando el comando `valet use php@version`. Valet instalará la versión de PHP especificada mediante Brew si aún no está instalada:

```php
valet use php@7.2

valet use php
```

::: danger Nota
Valet sólo ejecuta una versión de PHP a la vez, incluso si tienes múltiples versiones de PHP instaladas.
:::

#### Resetear tu instalación

Si estás teniendo problemas para que tu instalación de Valet funcione apropiadamente, ejecutar el comando `composer global update` seguido de `valet install` reseteará tu instalación y puede solucionar una variedad de problemas. En algunas ocasiones podría ser necesario un "reinicio forzado" ejecutando `valet uninstall --force` seguido de `valet install`.

<a name="upgrading"></a>
### Actualización

Puedes actualizar tu instalación de Valet ejecutando el comando `composer global update` desde la terminal. Después de actualizar, es una buena práctica ejecutar el comando `valet install` para que valet pueda hacer actualizaciones adicionales en sus archivos de configuración en caso de ser necesario.

<a name="serving-sites"></a>
## Activar sitios

Una vez que Valet haya sido instalado, estarás listo para activar sitios. Valet proporciona dos comandos para ayudarte a activar sitios de Laravel: `park` y `link`.

<a name="the-park-command"></a>
#### El comando `park`

-  Crea un nuevo directorio en tu Mac ejecutando algo como lo siguiente en la terminal `mkdir ~/Sites`. Después, `cd ~/Sites` y ejecuta `valet park`. Este comando va a registrar tu directorio actual como una ruta en la que Valet deberá buscar los sitios.
- Después, crea un nuevo sitio de laravel dentro de este directorio: `laravel new blog`.
- Abre tu navegador y dirígete a `http://blog.test`.

**Y eso es todo**. Ahora, cada proyecto de Laravel que crees dentro de tu directorio ~/Sites será visible desde el navegador utilizando la convención `http://folder-name.test`.

<a name="the-link-command"></a>
#### El comando `link`

El comando `link` también puede ser utilizado para enlazar sitios de Laravel. Este comando es útil si deseas configurar un solo sitio en un directorio y no todos los sitios dentro de él.

- Para utilizar este comando, deberás dirigirte a uno de tus proyectos desde la terminal y ejecutar `valet link app-name`. Valet creará un enlace simbólico en `~/.config/valet/Sites` el cuál apuntará hacia tu directorio actual.
- Después de ejecutar el comando `link`, podrás acceder al sitio desde tu navegador en `http://app-name.test`.

Para ver un listado de todos los directorios enlazados, ejecuta el comando `valet links`. Para destruir algún enlace simbólico deberás utilizar el comando `valet unlink app-name`.

::: tip TIP
Puedes utilizar `valet link` para configurar el mismo proyecto para multiples (sub)dominios. Para agregar un subdominio o un dominio diferente para tu proyecto ejecuta `valet link subdomain.app-name`.
:::

<a name="securing-sites"></a>
#### Asegurar sitios con TLS

Por defecto, Valet mostrará los sitios a través de HTTP plano. Sin embargo, si deseas que esté encriptado con TLS para ser utilizado con HTTP/2, el comando `secure` está disponible. Por ejemplo, si tu sitio está funcionando con Valet en el dominio `laravel.test`, podrás ejecutar el siguiente comando para asegurarlo:

```php
valet secure laravel
```

Para quitar esta seguridad al sitio y revertir los cambios de nuevo hacia HTTP plano, deberás utilizar el comando `unsecure`. Al igual que el comando `secure`, este comando acepta el nombre del host al que se desea quitar la encriptación TLS.

```php
valet unsecure laravel
```

<a name="sharing-sites"></a>
## Compartir sitios

Valet incluso tiene un comando para compartir tus sitios locales con el mundo, proporcionando una forma fácil de probar tus sitios en dispositivos móviles o compatirlo con miembros de tu equipo y clientes. Una vez que Valet está instalado no es necesario software adicional.

### Compartir sitios mediante Ngrok

Para compartir un sitio, deberás dirigirte hacia el directorio del sitio desde la terminal y ejecutar el comando `valet share`. Una URL accesible de manera pública será copiada a tu portapapeles y estará lista para que la pegues directamente en tu navegador.

Para detener la ejecución de `share` en tu sitio, presiona `Control + C` para cancelar el proceso.

::: danger TIP
Puedes pasar parametros adicionales al comando share, como `valet share --region=eu`. Para más información, consulta la [documentación de ngrok](https://ngrok.com/docs).
:::

### Compartir sitios en tu red local

Por defecto, Valet restringe el tráfico entrante a la interfaz `127.0.0.1`. De esta forma tu equipo de desarrollo no está expuesto a riesgos de seguridad en Internet.

Si deseas permitir que otros dispositivos en tu red local accedan a los sitios de Valet en tu equipo mediante la IP del computador (por ejemplo: `192.168.1.10/app-name.test`), necesitarás editar manualmente el archivo de configuración de Nginx apropiado para dicho sitio para remover la restricción en la directiva `listen` eliminando el prefijo `127.0.0.1:` en la directa para los puertos 80 y 443.

Si no has ejecutado `valet secure` en el proyecto, puedes abrir el acceso de la red para todos los sitios sin HTTPS ejecutando el archivo `/usr/local/etc/nginx/valet/valet.conf`. Sin embargo, si estás sirviendo el sitio del proyecto mediante HTTPS (has ejecutado `valet secure` para el sitio) entonces deberás editar el archivo `~/.config/valet/Nginx/app-name.test`.

Una vez que has actualizado la configuración de Nginx, ejecuta el comando `valet restart` para aplicar los cambios en la configuración.

<a name="site-specific-environment-variables"></a>
## Variables de entorno específicas del sitio

Algunas aplicaciones que utilizan otros frameworks pueden depender de las variables de entorno del servidor, pero no proporcionan una manera para que esas variables sean configuradas dentro de tu proyecto. Valet te permite configurar variables de entorno específicas del sitio agregando un archivo `.valet-env.php` dentro de la raíz de tu proyecto. Estas variables se agregarán al arreglo global `$_SERVER`:

```php
<?php

// Set $_SERVER['key'] to "value" for the foo.test site...
return [
    'foo' => [
        'key' => 'value',
    ],
];
// Set $_SERVER['key'] to "value" for all sites...
return [
    '*' => [
        'key' => 'value',
    ],
];
```

<a name="custom-valet-drivers"></a>
## Drivers de Valet personalizados

Puedes escribir tu propio "driver" de Valet para utilizar aplicaciones de PHP que se estén ejecutando en otro framework o en un CMS que no sea soportado de manera nativa por Valet. Cuando se hace la instalación de Valet, es creado un directorio `~/.config/valet/Drivers` que contiene un archivo `SampleValetDriver.php`. Este archivo contiene la implementación de un driver de muestra para demostrar cómo escribir un driver personalizado. Escribir un driver solo requiere que implementes tres métodos: `serves`, `isStaticFile`, y `frontControllerPath`.

Los tres métodos reciben los valores de `$sitePath`, `$siteName`, y `$uri` como argumentos. La variable `$sitePath` es la ruta completa del sitio que será configurado en tu equipo, algo como `/Users/Lisa/Sites/my-project`. La variable `$siteName` representa la porción "host" / "site-name" del dominio {`my-project`}. La variable `$uri` es la petición URI entrante (`/foo/bar`).

Una vez que hayas terminado con tu driver de valet personalizado, se deberá colocar en el directorio `~/.config/valet/Drivers` usando la convención `FrameworkValetDriver.php` para nombrarlo. Por ejemplo, si estás escribiendo un driver personalizado de valet para WordPress, tu archivo deberá ser `WordPressValetDriver.php`.

Echemos un vistazo a la implementación de ejemplo en cada uno de los metodos del driver personalizado de Valet.

#### El método `serves`

El método `serves` deberá retornar `true` si tu driver debe encargarse de las peticiones entrantes. De otra manera, este método deberá retornar `false`. Por lo tanto, dentro de este método deberás intentar determinar si el `$sitePath` dado contiene un proyecto del tipo que deseas configurar.

Por ejemplo, vamos a pretender que estamos escribiendo un `WordPressValetDriver`. Nuestro método `serves` podría verse mas o menos como esto:

```php
/**
* Determine if the driver serves the request.
*
* @param  string  $sitePath
* @param  string  $siteName
* @param  string  $uri
* @return bool
*/
public function serves($sitePath, $siteName, $uri)
{
    return is_dir($sitePath.'/wp-admin');
}
```

#### El método `isStaticFile`

El método `isStaticFile` deberá determinar si la petición entrante para un archivo es estático, como puede ser una imagen o una hoja de estilo. Si el archivo es estático, el método deberá retornar la ruta absoluta del archivo en disco. Si la petición entrante no es para un archivo estático, el metodo deberá retornar `false`:

```php
/**
* Determine if the incoming request is for a static file.
*
* @param  string  $sitePath
* @param  string  $siteName
* @param  string  $uri
* @return string|false
*/
public function isStaticFile($sitePath, $siteName, $uri)
{
    if (file_exists($staticFilePath = $sitePath.'/public/'.$uri)) {
        return $staticFilePath;
    }

    return false;
}
```

::: danger Nota
El método `isStaticFile` solo será llamado si el método `serves` retorna `true` para las peticiones entrantes y la URI es diferente a `/`.
:::

#### El método `frontControllerPath`

El método `frontControllerPath` deberá retornar la ruta absoluta del "front controller" de tu aplicación, que usualmente es el archivo "index.php" o su equivalente:

```php
/**
* Get the fully resolved path to the application's front controller.
*
* @param  string  $sitePath
* @param  string  $siteName
* @param  string  $uri
* @return string
*/
public function frontControllerPath($sitePath, $siteName, $uri)
{
    return $sitePath.'/public/index.php';
}
```

<a name="local-drivers"></a>
### Drivers locales

Si deseas definir un driver de Valet personalizado para una aplicación sencilla, deberás crear un archivo `LocalValetDriver.php` en el directorio raíz de tu aplicación. El driver personalizado deberá extender de la clase base `ValetDriver` o extender del driver de alguna aplicación existente, como puede ser `LaravelValetDriver`.

```php
class LocalValetDriver extends LaravelValetDriver
{
    /**
    * Determine if the driver serves the request.
    *
    * @param  string  $sitePath
    * @param  string  $siteName
    * @param  string  $uri
    * @return bool
    */
    public function serves($sitePath, $siteName, $uri)
    {
        return true;
    }

    /**
    * Get the fully resolved path to the application's front controller.
    *
    * @param  string  $sitePath
    * @param  string  $siteName
    * @param  string  $uri
    * @return string
    */
    public function frontControllerPath($sitePath, $siteName, $uri)
    {
        return $sitePath.'/public_html/index.php';
    }
}
```

<a name="other-valet-commands"></a>
## Otros comandos de Valet

Comando               | Descripción
--------------------- | -------------
`valet forget`        | Ejecuta este comando desde el directorio donde ejecutaste el comando `park` para eliminarlo de la lista de directorios configurados.
`valet log`           | Ver una lista de logs escritos por servicios de Valet.
`valet paths`         | Ver una lista de directorios configurados.
`valet restart`       | Reiniciar el daemon de Valet.
`valet start`         | Iniciar el daemon de Valet.
`valet stop`          | Detener el daemon de Valet.
`valet trust`         | Agrega archivos sudoers para Brew y Valet para permitir que los comandos de Valet se ejecuten sin solicitar contraseñas.
`valet uninstall`     | Desinstalar Valet: muestra instrucciones para la desinstalación manual; o pasa el parametro `--force` para eliminar Valet directamente.

<a name="valet-directories-and-files"></a>
## Archivos y directorios de Valet

Puedes encontrar útil la siguiente información sobre directorios y archivos al momento de solucionar problemas en tu entorno de Valet:

Archivo / Ruta | Descripción
-------------- | -----------
`~/.config/valet/` | Contiene toda la configuración de Valet. Es recomendable tener un respaldo de este directorio.
`~/.config/valet/dnsmasq.d/` | Contiene la configuración de DNSMasq.
`~/.config/valet/Drivers/` | Contiene drivers personalizados de Valet.
`~/.config/valet/Extensions/` | Contiene extensiones y comandos personalizados de Valet.
`~/.config/valet/Nginx/` | Contiene toda las configuraciones de Nginx generadas por Valet. Estos archivos son compilados de nuevo al ejecutar los comandos `install`, `secure` y `tld`.
`~/.config/valet/Sites/` | Contiene todos los enlaces símbolicos de proyectos enlazados.
`~/.config/valet/config.json` | Archivo de configuración principal de Valet.
`~/.config/valet/valet.sock` | Socket PHP-FPM usado por la configuración de Nginx de Valet. Esto sólo existirá si PHP se está ejecutando de forma apropiada.
`~/.config/valet/Log/fpm-php.www.log` | Registo de usuario para errores de PHP.
`~/.config/valet/Log/nginx-error.log` | Registro de usuario para errores de Nginx.
`/usr/local/var/log/php-fpm.log` | Registro de sistema para errores de PHP-FPM.
`/usr/local/var/log/nginx` | Contiene registros de acceso y error de Nginx.
`/usr/local/etc/php/X.X/conf.d` | Contiene archivos `*.ini` para varias configuraciones de PHP.
`/usr/local/etc/php/X.X/php-fpm.d/valet-fpm.conf` | Archivo de configuración de PHP-FPM.
`~/.composer/vendor/laravel/valet/cli/stubs/secure.valet.conf` | Configuración por defecto de Nginx usada para construir certificados de sitios.
