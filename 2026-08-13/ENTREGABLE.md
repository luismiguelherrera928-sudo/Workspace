# Entregable: Taller useEffect y Ciclo de Vida

## 🐛 Bug 1 — El reloj sigue corriendo aunque lo oculten

### Comportamiento raro observado
Al hacer clic en "Ocultar reloj", el componente desaparece de la pantalla, pero los logs de "tick" seguían imprimiéndose en la consola. El `setInterval` continuaba ejecutándose en segundo plano, causando un memory leak.

### Console.log usado para confirmar
```javascript
console.log('⏰ Reloj montado');
console.log('tick, segundos:', s + 1);
```
Después de ocultar el reloj, observé que los logs de "tick" no paraban de aparecer cada segundo, confirmando que el intervalo seguía activo.

### Corrección aplicada
```javascript
useEffect(() => {
  console.log('⏰ Reloj montado');
  const id = setInterval(() => {
    setSegundos((s) => {
      console.log('tick, segundos:', s + 1);
      return s + 1;
    });
  }, 1000);
  return () => clearInterval(id); // ✅ Agregar el cleanup
}, []);
```

### Fase del ciclo de vida
**Falta de limpieza al desmontar**: El cleanup (la función retornada) se ejecuta cuando el componente se desmonta. Sin él, el intervalo sigue corriendo en segundo plano después de que el componente desaparece de pantalla.

---

## 🐛 Bug 2 — El contador automático se queda pegado en 1

### Comportamiento raro observado
El número en pantalla subía a 1 y se quedaba congelado sin avanzar más, aunque la consola seguía imprimiendo mensajes cada segundo. Era un caso clásico de "stale closure" (closure obsoleta).

### Console.log usado para confirmar
```javascript
console.log('El contador según el efecto es:', contador);
```
Los logs mostraban que `contador` siempre imprimía 0, aunque en pantalla debería haber avanzado. Esto confirmó que el efecto "recordaba" el valor inicial de `contador` cuando se creó, no el valor actual.

### Corrección aplicada
```javascript
useEffect(() => {
  const id = setInterval(() => {
    console.log('El contador está incrementando correctamente');
    setContador((c) => c + 1); // ✅ Usar la forma funcional
  }, 1000);
  return () => clearInterval(id);
}, []);
```

### Fase del ciclo de vida
**Problema de actualización con dependencias vacías**: Aunque el efecto se ejecuta una sola vez (al montar), al usar `contador` directamente en lugar de la forma funcional `(c) => c + 1`, el efecto queda "congelado" leyendo el valor inicial. La forma funcional accede al valor actual en tiempo real.

---

## 🐛 Bug 3 — El ancho de ventana duplica los mensajes

### Comportamiento raro observado
Al cambiar el tamaño de la ventana varias veces, cada resize imprimía un número de mensajes cada vez mayor. La primera vez imprimía 1 mensaje, la segunda vez imprimía 2, la tercera vez 3, etc. Esto indicaba que se estaban agregando listeners duplicados sin remover los anteriores.

### Console.log usado para confirmar
```javascript
console.log('Resize detectado, ancho:', window.innerWidth);
```
Conté cuántas veces se repetía este log en la consola para cada evento de resize. Confirmé que se duplicaba exponencialmente, indicando que no se removía el listener anterior.

### Corrección aplicada
```javascript
useEffect(() => {
  function manejarResize() {
    console.log('Resize detectado, ancho:', window.innerWidth);
    setAncho(window.innerWidth);
  }
  window.addEventListener('resize', manejarResize);
  return () => window.removeEventListener('resize', manejarResize); // ✅ Cleanup
}, []); // ✅ Cambiar a dependencias vacías
```

### Fase del ciclo de vida
**Falta de limpieza en la actualización**: El efecto estaba configurado con `[ancho]` como dependencia, lo que hacía que se ejecutara cada vez que `ancho` cambiaba. Sin el cleanup, se agregaba un nuevo listener sin remover el anterior, causando duplicados.

---

## 🐛 Bug 4 — El nombre no cambia al elegir otro usuario

### Comportamiento raro observado
Al hacer clic en "Usuario 2", el botón cambiaba de estado visual, pero en pantalla seguía mostrando "Nombre: Ana" en lugar de cambiar a "Nombre: Luis". El cambio de usuario no disparaba la actualización del nombre.

### Console.log usado para confirmar
```javascript
console.log('Buscando datos del usuario', id);
```
Al cambiar de usuario, este log no se imprimía de nuevo. Confirmó que el efecto no se estaba ejecutando cuando cambiaba la prop `id`.

### Corrección aplicada
```javascript
useEffect(() => {
  console.log('Buscando datos del usuario', id);
  const nombres = { 1: 'Ana', 2: 'Luis' };
  setNombre(nombres[id]);
}, [id]); // ✅ Agregar 'id' a las dependencias
```

### Fase del ciclo de vida
**Falta de dependencia en la actualización**: El efecto usaba `id` pero no lo incluía en el arreglo de dependencias. React no sabía que debía ejecutar el efecto nuevamente cuando `id` cambiaba, así que se quedaba con el nombre del primer usuario.

---

## 📊 Experimento Guiado — Predicciones vs. Realidad (Parte 4)

### Variante 1: Con `[clics]` como dependencia (configuración original)

**Predijo:**
- El efecto se ejecutaría al montar (🟢 MONTADO)
- Cada clic activaría una actualización (🔵 ACTUALIZADO)
- El cleanup se ejecutaría antes de cada nueva actualización

**Lo que pasó realmente:**
- ✅ Correcto: 🟢 MONTADO se imprimió una sola vez al cargar
- ✅ Correcto: 🔵 ACTUALIZADO se imprimió con cada clic (mostrando el número de clics)
- ✅ Correcto: 🔴 LIMPIEZA se ejecutó justo antes de cada nueva actualización

**Observación:** El patrón fue: MONTADO → LIMPIEZA + ACTUALIZADO → LIMPIEZA + ACTUALIZADO...

---

### Variante 2: Cambiar a `[]` (arreglo vacío)

**Predijo:**
- El efecto se ejecutaría al montar (🟢 MONTADO)
- No aparecería 🔵 ACTUALIZADO nunca
- El cleanup solo se ejecutaría al desmontar

**Lo que pasó realmente:**
- ✅ Correcto: 🟢 MONTADO se imprimió una sola vez
- ✅ Correcto: No aparecía 🔵 ACTUALIZADO aunque se hiciera clic
- ✅ Correcto: El cleanup no se ejecutaba hasta que el componente se desmontaba

**Observación:** Con dependencias vacías, el efecto es completamente "estático" — no reacciona a cambios de estado.

---

### Variante 3: Sin arreglo de dependencias (sin parámetro)

**Predijo:**
- El efecto se ejecutaría en CADA render
- Habría muchas ejecuciones de LIMPIEZA
- El patrón sería: MONTADO → LIMPIEZA + ACTUALIZADO → LIMPIEZA + ACTUALIZADO (en cada render)

**Lo que pasó realmente:**
- ✅ Correcto: El efecto se ejecutaba en cada render, no solo en cambios de clics
- ✅ Correcto: 🔴 LIMPIEZA se ejecutaba múltiples veces por segundo
- ✅ Correcto: Fue como si el efecto nunca tuviera "descanso"

**Observación:** Sin arreglo de dependencias es prácticamente nunca lo que quieren en producción porque causa re-ejecuciones constantes y puede degradar el rendimiento.

---

### Variante 4: Envuelto en mostrar/ocultar (simulando desmontaje)

**Predijo:**
- Cuando se oculta el componente, se ejecuta 🔴 LIMPIEZA por el desmontaje real
- Cuando se vuelve a mostrar, se ejecuta 🟢 MONTADO de nuevo

**Lo que pasó realmente:**
- ✅ Correcto: Al ocultar aparecía 🔴 LIMPIEZA inmediatamente
- ✅ Correcto: Al mostrar de nuevo aparecía 🟢 MONTADO y el contador de clics se reiniciaba desde 0
- ✅ Correcto: Se confirma que el cleanup se ejecuta tanto al actualizar como al desmontar

**Observación:** Esto muestra la importancia del cleanup para liberar recursos cuando los componentes desaparecen.

---

## 🎯 Conclusión

El cleanup se ejecuta en dos momentos:
1. **Antes de que el efecto se repita** (cuando una dependencia cambia)
2. **Al desmontar el componente** (cuando desaparece de pantalla)

Esto explica por qué el Bug 3 causaba listeners duplicados: sin cleanup, cada ejecución del efecto agregaba un nuevo listener sin remover el anterior. Con cleanup, el viejo listener se remueve antes de agregar uno nuevo.

