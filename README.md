# Motoscout-Comparator

Dies ist keine offizielle Erweiterung von Motoscout24!

Das Icon ist von [Font Awesome](https://fontawesome.com/).

## Installation

1. Lade den neuesten Release dieses Repository herunter.
2. Öffne Firefox und gehe auf [about:addons](about:addons).
3. Klicke auf das Zahnrad und wähle `Add-on aus Datei installieren...`.
4. Wähle die heruntergeladene `.zip` Datei aus.

## Anleitung

Wird die Seite [motoscout24.ch](https://www.motoscout24.ch) aufgerufen, erscheint unter den Filtern ein neuer Button `Generate Chart`. Wird dieser angeklickt, wird ein Chart erstellt. Die Datenpunkte im Diagramm können angeklickt werden.

Wichtig: Die Erweiterung erkennt nicht, wenn sich die URL ändert. Wird der Filter oder das Modell/Marke verändert, muss das Diagramm mit einem Klick auf `Generate Chart` aktualisiert werden. Wird der Button nicht angezeigt, kann die Seite neu geladen werden.

## Testen

Um die App zu testen, kann eine der beiden Methoden verwendet werden:

### Run with `Web-Ext`:

Installiere `web-ext` mithilfe dieser Webseite: [extensionworkshop.com](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/)

Um die Erweiterung zu testen, führe den folgenden Befehl aus:

```bash
web-ext run
```

### Temporär in Firefox installieren:

1. Lade das Repository als Zip herunter. Klicke dazu auf den grünen Button `Code` und wähle `Download ZIP`.
1. Öffne [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox)
1. Klicke auf `Temporäres Add-on laden...`
