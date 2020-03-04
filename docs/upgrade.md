:::pre
# Guía de Actualización

- [Actualizando a 7.0 desde 6.x](#upgrade-7.0)

<a name="high-impact-changes"></a>
## Cambios de alto impacto

- [Actualizaciones relacionadas con Symfony 5](#symfony-5-related-upgrades)
- [Autenticación Scaffolding](#authentication-scaffolding)
- [Serialización de fechas](#date-serialization)

<a name="medium-impact-changes"></a>
## Cambios de mediano impacto

- [El método `Blade::component`](#the-blade-component-method)
- [Blade Components y "Blade X"](#blade-components-and-blade-x)
- [Tipos de Factory](#factory-types)
- [La regla de validación `different`](#the-different-rule)
- [La aserción `assertSee`](#assert-see)

<a name="upgrade-7.0"></a>

## Actualizando a 7.0 desde 6.x

#### Tiempo de actualización estimado: 15 Minutos

::: danger NOTA
Intentamos documentar cada posible cambio de ruptura (breaking change). Dado que algunos de estos cambios de ruptura se encuentran en las partes oscuras del framework, solo una parte de estos cambios puede afectar tu aplicación.
:::

### Requiere Symfony 5

**Probabilidad de impacto: Alto**

Laravel 7 actualizó sus componentes subyacentes de Symfony a la serie 5.x, que ahora es también la nueva versión mínima compatible.

### Requiere PHP 7.2.5

**Probabilidad de impacto: Bajo**

La nueva versión mínima de PHP es ahora 7.2.5.

<a name="updating-dependencies"></a>
### Actualizando Dependencias

Actualice su dependencia de `laravel/framework` a `^7.0` en su archivo `composer.json`. Además, actualice su dependencia `nunomaduro/collision` a `^4.1`.

Los siguientes paquetes de origen tienen nuevas versiones principales para admitir Laravel 7. Si hay alguno, lea sus guías de actualización individuales antes de actualizar:

- [Browser Kit Testing v6.0](https://github.com/laravel/browser-kit-testing/blob/master/UPGRADE.md)
- [Envoy v2.0](https://github.com/laravel/envoy/blob/master/UPGRADE.md)
- [Horizon v4.0](https://github.com/laravel/horizon/blob/master/UPGRADE.md)
- [Nova v3.0](https://nova.laravel.com/releases)
- [Scout v8.0](https://github.com/laravel/scout/blob/master/UPGRADE.md)
- UI v2.0 (No changes necessary)

Finalmente, examine cualquier otro paquete de terceros consumido por su aplicación y verifique que está utilizando la versión adecuada para el soporte de Laravel 7.

<a name="symfony-5-related-upgrades"></a>
### Actualizaciones relacionadas con Symfony 5

**Probabilidad de impacto: Alto**

Laravel 7 utiliza la serie 5.x de los componentes Symfony. Se requieren algunos cambios menores en la aplicación para adaptar esta actualización.

En primer lugar, los métodos `report` y `render` de la clase `App\Exceptions\Handler` de su aplicación deben aceptar instancias de la interfaz `Throwable` en lugar de instancias `Exception`:

```php
use Throwable;

public function report(Throwable $exception);
public function render($request, Throwable $exception);
```

A continuación, por favor, actualice la opción `secure` de su archivo de configuración de `session` para que tenga un valor de reserva `null` y la opción `same_site` para que tenga un valor de reserva `lax`.

```php
'secure' => env('SESSION_SECURE_COOKIE', null),

'same_site' => 'lax',
```

### Autenticación

<a name="authentication-scaffolding"></a>
#### Scaffolding

**Probabilidad de impacto: Alto**

Todas las autenticaciones scaffolding han sido movidas al repositorio  `laravel/ui`.  Si está usando la autenticación scaffolding de Laravel, debe instalar la versión `^2.0` de este paquete:

```shell
composer require laravel/ui "^2.0"
```

#### El `TokenRepositoryInterface`

**Probabilidad de impacto: Bajo**

Se ha agregado un método `recentlyCreatedToken` a la interfaz `Illuminate\Auth\Passwords\TokenRepositoryInterface`. Si estás escribiendo una implementación personalizada de esta interfaz, debes agregar este método a su implementación.

### Blade

<a name="the-blade-component-method"></a>
#### El método `component` 

**Probabilidad de impacto: Medio**

El método `Blade::component` ha sido renombrado a `Blade::aliasComponent`. Por favor, actualice sus llamadas a este método en consecuencia.

<a name="blade-components-and-blade-x"></a>
#### Blade Components y "Blade X"

**Probabilidad de impacto: Medio**

Laravel 7 incluye sorpote propio para los "componentes de etiqueta" de Blade. Si desea desactivar la funcionalidad integrada del componente de etiquetas de Blade, puede llamar al método `withoutComponentTags` desde el método `boot` de su `AppServiceProvider`:

```php
use Illuminate\Support\Facades\Blade;

Blade::withoutComponentTags();
```

### Eloquent

#### Los métodos `addHidden` / `addVisible` 

**Probabilidad de impacto: Bajo**

Se han eliminado los métodos no documentados `addHidden` y `addVisible`. En su lugar, utilice los métodos `makeHidden` y `makeVisible`. 

#### Los métodos `booting` / `booted` 

**Probabilidad de impacto: Bajo**

Los métodos `booting` y `booted` se han agregado a Eloquent para proporcionar un lugar para definir convenientemente cualquier lógica que deba ejecutarse durante el proceso "boot" del modelo. Si ya tiene métodos del modelo con estos nombres, tendrá que cambiar el nombre de sus métodos para que no entren en conflicto con los métodos recién agregados.

<a name="date-serialization"></a>
#### Serialización de fechas

**Probabilidad de impacto: Alto**

Laravel 7 usa un nuevo formato de serialización de fecha cuando se utiliza el método `toArray` o `toJson` en modelos Eloquent. Para dar formato a las fechas de serialización, el marco de trabajo ahora utiliza el método `toJSON` de Carbon, el cual produce una fecha compatible con ISO-8601 incluyendo información de la zona horaria y los segundos fraccionarios. Además, este cambio proporciona un mejor soporte e integración con las bibliotecas de análisis de fechas del lado del cliente.

Anteriormente, las fechas se serializaban en un formato como el siguiente: `2019-12-02 20:01:00`. Las fechas serializadas con el nuevo formato aparecerán como: `2019-12-02T20:01:00.283041Z`. 

Si deseas seguir usando el comportamiento anterior puedes anular el método `serializeDate` en tu modelo:

```php
/**
* Prepare a date for array / JSON serialization.
*
* @param  \DateTimeInterface  $date
* @return string
*/
protected function serializeDate(DateTimeInterface $date)
{
    return $date->format('Y-m-d H:i:s');
}
```

::: tip TIP
Este cambio solo afecta la serialización de modelos y colecciones de modelos para arreglos y JSON. Este cambio no tiene efecto sobre cómo se almacenan las fechas en su base de datos.
:::

<a name="factory-types"></a>
#### Tipos de Factory 

**Probabilidad de impacto: Medio**

Laravel 7 elimina la característica de los "tipos de factory". Esta característica no ha sido documentada desde octubre de 2016. Si todavía usa esta característica, debería actualizar a [factory states](/docs/{{version}}/database-testing#factory-states), que proporcionan más flexibilidad.

#### El método `getOriginal` 

**Probabilidad de impacto: Bajo**

El método `$model->getOriginal()` ahora respetará las conversiones definidas en el modelo. Anteriormente, este método devolvía los atributos sin procesar. Si desea continuar recuperando los valores sin procesar, puede usar el método `getRawOriginal` en su lugar.

#### Enlace de Ruta

**Probabilidad de impacto: Bajo**

El método `resolveRouteBinding` de la interfaz `Illuminate\Contracts\Routing\UrlRoutable` ahora acepta un argumento `$field`. Si estaba implementando esta interfaz a mano, debería actualizar su implementación.

Además, el método `resolveRouteBinding` de la clase `Illuminate\Database\Eloquent\Model` ahora también acepta un parámetro `$field`. Si estaba reemplazando este método, debe actualizar su método para aceptar este argumento. 

Finalmente, el método `resolveRouteBinding` del trait `Illuminate\Http\Resources\DelegatesToResources` ahora también acepta el parámetro `$field`. Si estaba reemplazando este método, debe actualizar su método para aceptar este argumento. 

### HTTP

#### Compatibilidad con PSR-7

**Probabilidad de impacto: Bajo**

La biblioteca Zend Diactoros para generar respuestas PSR-7 ha quedado en desuso. Si está usando este paquete para la compatibilidad con PSR-7, por favor, instale en su lugar el paquete de Composer `nyholm/psr7`. Además, por favor, instale la versión `^2.0` del paquete de Composer `symfony/psr-http-message-bridge`.

### Correo

#### Cambios en el archivo de configuración

**Probabilidad de impacto: Opcional**

Para poder soportar múltiples correos, el archivo de configuración por defecto de `mail` ha cambiado en Laravel 7.x para incluir un array de `mailers`.  Sin embargo, para preservar la compatibilidad con versiones anteriores, el formato Laravel 6.x de este archivo de configuración todavía se admite. Por lo tanto, no hay cambios **requeridos** cuando se actualiza a Laravel 7.x; sin embargo, es posible que desee [examinar la nueva estructura del archivo de configuración de `mail`](https://github.com/laravel/laravel/blob/develop/config/mail.php) y actualizar su archivo para reflejar los cambios.

#### Actualizaciones de la plantilla de correo de Markdown 

**Probabilidad de impacto: Bajo**

Las plantillas de correo de Markdown predeterminadas se han actualizado con un diseño más profesional y atractivo. Además, se ha eliminado el componente de correo de Markdown `promotion` no documentado.

### Queue

#### Se ha eliminado la bandera `--daemon` en desuso

**Probabilidad de impacto: Bajo**

Se ha eliminado la bandera `--daemon` en desuso en el comando `queue:work`. Esta bandera ya no es necesaria ya que el trabajo se ejecuta como un demonio por defecto.

### Recursos

#### La clase `Illuminate\Http\Resources\Json\Resource` 

**Probabilidad de impacto: Bajo**

Se ha eliminado la clase en desuso `Illuminate\Http\Resources\Json\Resource`. En su lugar, los recursos deben extender la clase `Illuminate\Http\Resources\Json\JsonResource`.

### Rutas

#### El método de rutas `getRoutes` 

**Probabilidad de impacto: Bajo**

El método de rutas `getRoutes`ahora devuelve una instancia de `Illuminate\Routing\RouteCollectionInterface` en lugar de `Illuminate\Routing\RouteCollection`. 

### Sesión

#### El controlador de sesión `array`

**Probabilidad de impacto: Bajo**

Los datos del controlador de sesión `array` ahora son persistentes para la solicitud actual. Anteriormente, los datos almacenados en la sesión `array` no podían ser recuperados ni siquiera durante la solicitud actual.

### Pruebas

<a name="assert-see"></a>
#### La aserción `assertSee`

**Probabilidad de impacto: Medio**

Las aserciones `assertSee` y `assertDontSee` en la clase `TestResponse` ahora escaparán automáticamente los valores. Si está escapando manualmente cualquier valor pasado a estas aserciones, ya no debería hacerlo.

### Validación

<a name="the-different-rule"></a>
#### La regla `different` 

**Probabilidad de impacto: Medio**

La regla `different` ahora fallará si falta uno de los parámetros especificados en la solicitud.

<a name="miscellaneous"></a>
### Misceláneos

También te recomendamos que veas los cambios en el [repositorio de Github](https://github.com/laravel/laravel) `laravel/laravel`.  Si bien muchos de estos cambios no son necesarios, es posible que desees mantener estos archivos sincronizados con tu aplicación. Algunos de estos cambios se tratarán en esta guía de actualización, pero otros, como los cambios en los archivos de configuración o los comentarios, no lo estarán. Puedes ver fácilmente los cambios con la [herramienta de comparación GitHub](https://github.com/laravel/laravel/compare/6.0...master) y elegir qué actualizaciones son importantes para ti.
:::
