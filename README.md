# Motoscout-Comparator

Das Icon ist von [Font Awesome](https://fontawesome.com/).

## Testen

Um die App zu testen kann eine der beiden Methoden verwendet werden:

### Run with `Web-Ext`:

Installiere `web-ext` mithilfe dieser Webseite: [extensionworkshop.com](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/)

Um die Erweiterung zu testen führe folgenden Befehlt aus:

```bash
web-ext run
```

### Temporär in Firefox installieren:

1. Lade das Repository als Zip herunter. Clicke dazu auf den grünen Button `Code` und wähle `Download ZIP`.
1. Öffne [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)
1. Klicke auf `Temporäres Add-on laden...`

## Anleitung

Wird die Seite [motoscout24.ch](https://www.motoscout24.ch) aufgerufen erscheit unter den Filtern ein neuer Button `Generate Chart`. Wird dieser angeklickt, wird ein Chart erstellt. Die Datenpunkte im Diagramm können angeklickt werden.

Wichtig: Wird der Filter oder das Modell/Marke geändert, muss das Diagramm mit einem Klick auf `Generate Chart` aktualisiert werden.
