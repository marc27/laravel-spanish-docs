:::pre
# Guía de Actualización

- [Actualizando a 7.0 desde 6.0](#upgrade-7.0)

<a name="high-impact-changes"></a>
## Cambios de alto impacto

- [Serialización de fechas](#date-serialization)

<a name="medium-impact-changes"></a>
## Cambios de mediano impacto

- ...

<a name="upgrade-7.0"></a>

## Actualizando a 7.0 desde 6.0

#### Tiempo de actualización estimado: ?

::: danger NOTA
Intentamos documentar cada posible cambio de ruptura (breaking change). Dado que algunos de estos cambios de ruptura se encuentran en las partes oscuras del framework, solo una parte de estos cambios puede afectar tu aplicación.
:::

### Requiere Symfony 5

**Probabilidad de impacto: Medio**

Laravel 7 añade soporte para Symfony 5, que ahora es también la nueva versión mínima compatible.

### Requiere PHP 7.2.5

**Probabilidad de impacto: Bajo**

La nueva versión mínima de PHP (que imita a Symfony 5.0) es ahora 7.2.5.

<a name="updating-dependencies"></a>
### Actualizando Dependencias

Actualice su dependencia de `laravel/framework` a `^7.0` en su archivo `composer.json`.

A continuación, examine cualquier paquete de terceros consumido por su aplicación y verifique que está utilizando la versión adecuada para el soporte de Laravel 7.

### Eloquent

<a name="date-serialization"></a>
#### Serialización de fechas

**Probabilidad de impacto: Alto**

Laravel 7 viene con un nuevo valor por defecto para serializar fechas cuando se utiliza el método `toArray` o `toJson` en modelos Eloquent. Hace uso del comportamiento por defecto de Carbon `toJSON` y proporcionará una cadena de fecha y hora con fracciones e información de la zona horaria.

El comportamiento anterior serializaría una fecha, por ejemplo, a `2019-12-02 20:01:00`. El nuevo comportamiento serializará una fecha a algo como `2019-12-02T20:01:00.283041Z`. Esto proporcionará más información si, por ejemplo, estás construyendo API's.

Si quieres seguir usando el comportamiento anterior puedes anular el método `serializeDate` en tu modelo:

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

<a name="miscellaneous"></a>
### Misceláneos

También te recomendamos que veas los cambios en el [repositorio de Github](https://github.com/laravel/laravel) `laravel/laravel`.  Si bien muchos de estos cambios no son necesarios, es posible que desees mantener estos archivos sincronizados con tu aplicación. Algunos de estos cambios se tratarán en esta guía de actualización, pero otros, como los cambios en los archivos de configuración o los comentarios, no lo estarán. Puedes ver fácilmente los cambios con la [herramienta de comparación GitHub](https://github.com/laravel/laravel/compare/6.0...master) y elegir qué actualizaciones son importantes para ti.
:::
