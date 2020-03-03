:::pre
# Guía de Actualización

- [Actualizando a 7.0 desde 6.0](#upgrade-7.0)

<a name="high-impact-changes"></a>
## Cambios de alto impacto

- [Serialización de fechas](#date-serialization)

<a name="medium-impact-changes"></a>
## Cambios de mediano impacto

- [Tipos de Factory](#factory-types)

<a name="upgrade-7.0"></a>

## Actualizando a 7.0 desde 6.0

#### Tiempo de actualización estimado: 15 Minutos

::: danger NOTA
Intentamos documentar cada posible cambio de ruptura (breaking change). Dado que algunos de estos cambios de ruptura se encuentran en las partes oscuras del framework, solo una parte de estos cambios puede afectar tu aplicación.
:::

### Requiere Symfony 5

**Probabilidad de impacto: Medio**

Laravel 7 actualiza sus componentes subyacentes de Symfony a la serie 5.x, que ahora es también la nueva versión mínima compatible.

### Requiere PHP 7.2.5

**Probabilidad de impacto: Bajo**

La nueva versión mínima de PHP es ahora 7.2.5.

<a name="updating-dependencies"></a>
### Actualizando Dependencias

Actualice su dependencia de `laravel/framework` a `^7.0` en su archivo `composer.json`. Además, actualice su dependencia `nunomaduro/collision` a `^4.0`.

Finalmente, examine cualquier paquete de terceros consumido por su aplicación y verifique que está utilizando la versión adecuada para el soporte de Laravel 7.

### Autenticación

#### El `TokenRepositoryInterface`

**Probabilidad de impacto: Muy Bajo**

Se ha agregado un método `recentlyCreatedToken` a la interfaz `Illuminate\Auth\Passwords\TokenRepositoryInterface`. Si estás escribiendo una implementación personalizada de esta interfaz, debes agregar este método a su implementación.

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
Este cambio solo afecta la serialización de modelos y colecciones de modelos para arreglos y JSON. Este cambio no tiene ningún efecto sobre cómo se almacenan las fechas en su base de datos.
:::

<a name="factory-types"></a>
#### Tipos de Factory 

**Probabilidad de impacto: Medio**

Laravel 7 elimina la característica de los "tipos de factory". Esta característica no ha sido documentada desde octubre de 2016. Si todavía usa esta característica, debería actualizar a [factory states](/docs/{{version}}/database-testing#factory-states), que proporcionan más flexibilidad.

#### El método `getOriginal` 

**Probabilidad d eimpacto: Bajo**

El método `$model->getOriginal()` ahora respetará las conversiones definidas en el modelo. Anteriormente, este método devolvía los atributos sin formato. 

### Queue

#### Se ha eliminado la bandera `--daemon` en desuso

Se ha eliminado la bandera `--daemon` en desuso en el comando `queue:work`. Esta bandera ya no es necesaria ya que el trabajo se ejecuta como un demonio por defecto.

### Recursos

#### La clase `Illuminate\Http\Resources\Json\Resource` 

Se ha eliminado la clase en desuso `Illuminate\Http\Resources\Json\Resource`. En su lugar, los recursos deben extender la clase `Illuminate\Http\Resources\Json\JsonResource`.

### Sesión

#### El controlador de sesión `array`

**Probabilidad d eimpacto: Bajo**

Los datos del controlador de sesión `array` ahora son persistentes para la solicitud actual. Anteriormente, los datos almacenados en la sesión `array` no podían ser recuperados ni siquiera durante la solicitud actual.

<a name="miscellaneous"></a>
### Misceláneos

También te recomendamos que veas los cambios en el [repositorio de Github](https://github.com/laravel/laravel) `laravel/laravel`.  Si bien muchos de estos cambios no son necesarios, es posible que desees mantener estos archivos sincronizados con tu aplicación. Algunos de estos cambios se tratarán en esta guía de actualización, pero otros, como los cambios en los archivos de configuración o los comentarios, no lo estarán. Puedes ver fácilmente los cambios con la [herramienta de comparación GitHub](https://github.com/laravel/laravel/compare/6.0...master) y elegir qué actualizaciones son importantes para ti.
:::
