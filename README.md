# NEXA Display · Demostración estática

Proyecto demostrativo de señalización digital **HTML + CSS + JavaScript**. Reproduce imágenes y videos MP4 en loop, sin backend. Los recursos y el nombre NEXA son ficticios.

## Publicar en GitHub Pages

1. En GitHub crea un repositorio **público** llamado, por ejemplo, `pantalla-empresa-demo`.
2. Sube **el contenido de esta carpeta** a la raíz del repositorio (index.html, player.js, styles.css, playlist.json y la carpeta media), no el ZIP.
3. Ve a **Settings → Pages** y en **Build and deployment** selecciona **Deploy from a branch**. Escoge **main** y **/(root)**, luego **Save**.
4. La URL tendrá la forma `https://TU-USUARIO.github.io/pantalla-empresa-demo/`. El despliegue puede tardar unos minutos.
5. Visita la URL en Chrome y pulsa **Iniciar pantalla completa**.

## Ejecutar localmente en Windows con un clic

Si tienes Python instalado, haz doble clic en `INICIAR_EN_WINDOWS.bat`; se abrirá `http://localhost:8000`. Deja abierta la ventana negra mientras lo uses. No se necesita instalar Flask.

Alternativa manual:

```bash
python -m http.server 8000
```

**Importante:** no abras `index.html` directamente con doble clic, porque la lectura de `playlist.json` puede fallar con `file://`.

## Mostrarlo en Roku TV mediante duplicación de pantalla

- Conecta la computadora y el Roku a la misma red y habilita **Screen mirroring** en Roku si el modelo lo admite.
- En Windows, presiona **Win + K** y selecciona el Roku compatible, o conecta la computadora al televisor por HDMI.
- Abre la página en Chrome/Edge y usa el botón **Iniciar pantalla completa** (o F11).
- La computadora debe permanecer encendida. La experiencia mediante duplicación depende de la red y de la compatibilidad Miracast.

## Cambiar el contenido

Edita `playlist.json`:

```json
{
  "items": [
    { "type": "image", "src": "media/bienvenida.jpg", "duration": 7, "title": "Bienvenida" },
    { "type": "video", "src": "media/demo.mp4", "title": "Video institucional" }
  ]
}
```

- Las rutas son relativas al repositorio. Los tipos son `image` o `video`.
- `duration` está en segundos para las imágenes; el video termina cuando el archivo termina.
- Guarda nuevos archivos en `media/`, publícalos mediante un commit en GitHub y añade referencias a la lista.
- El reproductor comprueba si cambió `playlist.json` aproximadamente cada 60 segundos. Un navegador o una CDN pueden mantener temporalmente otros recursos en caché; usa nombres nuevos para archivos modificados si es necesario.
- Video recomendado: MP4 con H.264 (sin audio para autoplay más fiable). El reproductor reproduce los videos silenciados.

## Alcances de la demo

- **Sí:** GitHub Pages, loop, fotos, video MP4, duración configurable, pantalla completa, actualización de la lista.
- **No:** panel de carga remota desde la página, inicio de sesión, base de datos, programación horaria, almacenamiento privado ni control remoto del dispositivo.
- **GitHub Pages no ejecuta Flask ni Python**. Los archivos subidos al repositorio público son visibles públicamente.
- **Roku TV no abre esta página por sí solo**: requiere un dispositivo que ejecute un navegador o duplicación de pantalla.
- Para producción hace falta una política de almacenamiento, administración segura, estabilidad 24/7 y operación desatendida.

## Estructura

```
index.html
styles.css
player.js
playlist.json
media/
  bienvenida.jpg
  servicios.jpg
  contacto.jpg
  demo.mp4
INICIAR_EN_WINDOWS.bat
README.md
```
