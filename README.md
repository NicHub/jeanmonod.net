# jeanmonod.net

Version locale Hugo du site jeanmonod.net.

## Données et génération

Les fichiers JSON du répertoire `data/` sont les **sources de vérité** du site :

- `data/books.json`
- `data/websites.json`
- `data/cds.json`

Hugo les utilise pour générer les pages HTML, les cartes des portfolios et les blocs JSON-LD. Le montage Hugo les expose aussi publiquement sous `/data/*.json`, sans créer de copie distincte.

Le thème est séparé dans `themes/jeanmonod.net/`. Le site reste local jusqu’à validation.

## Développement

```sh
hugo server
hugo --minify
```

Les anciennes sources sont conservées dans `jeanmonod.net---old/`.
