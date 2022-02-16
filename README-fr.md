<img align="right" src="https://i.imgur.com/YH44Vbg.png" height="200" width="200">

# Voxdle

Voxdle est un clone français/anglais de [Wordle](https://www.powerlanguage.co.uk/wordle/), un jeu de lettres créé en 2021 par Josh Wardle ([@powerlanguish](https://twitter.com/powerlanguish)).

Au concept de base, Voxdle offre la possibilité de jouer avec son microphone à la place du clavier. Pour cela, il utilise les fonctionnalités de la [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) implémentées actuellement :
* sur ordinateur par les navigateurs Chrome, Edge et Safari;
* sur mobile par les navigateurs Chrome Android, Safari sur iOS, et Samsung Internet.

Pour les utilisateurs ne passant pas par ces navigateurs, il reste évidemment la possibilité de jouer normalement à Voxdle.

## Pourquoi ?

J'ai commencé à m'intéresser à la reconnaissance vocale sur le web ces dernières semaines et j'ai rapidement cherché une idée d'application concrète. La popularité récente de Wordle dans mon entourage m'a donné envie de transposer son gameplay en mode commande vocale.

À l'origine, je souhaitais permettre aux joueurs d'épeler directement les mots, mais l'interprétation différait fortement en fonction du navigateur ou de la plateforme utilisée. Après avoir un temps considéré l'utilisation de l'alphabet radio, j'ai finalement opté pour une solution demandant au joueur de faire précéder chaque lettre du mot à tester par la phrase "*La lettre …*". Cet indicateur place l'interpréteur dans l'expectative de la lecture d'une lettre dans le message.

Il arrive que l'interpréteur donne des résultats incorrects ou déformés par rapport à ce qui a été réellement prononcé. Cela dépend notamment du contexte de la capture. Afin d'améliorer la reconnaissance des lettres, j'ai configuré l'interpréteur avec des [gramogrammes](https://en.wikipedia.org/wiki/Gramogram) pour chaque lettre de l'alphabet. Un gramogramme est un groupe de lettres qui, prononcées, forment un son rappelant un mot. Par exemple

* la lettre "*L*" prononcée peut s'interpréter par le mot "*aile*"
* la lettre "*M*" prononcée peut s'interpréter par le mot "*aime*"
* la lettre "*N*" prononcée peut s'interpréter par le mot "*haine*"

## Comment y jouer ?

<img align="right" src="https://i.imgur.com/uZaYn0a.png" height="237" width="200">

La version publique du jeu se trouve ici : https://voxdle.u2042.com

### Démarrage de la captation du microphone

Pour activer la fonctionnalité microphone, il suffit de cliquer sur l'icône microphone située en haut de l'interface de jeu.

### Commandes vocales

Au démarrage de la captation, une boite de dialogue récapitulera les commandes vocales reconnues par Voxdle :

* **la lettre W** : ajouter une nouvelle lettre W
* **confirmer** (ou **valider**) : valider le mot saisi
* **corriger** (ou **annuler**) : corriger la saisie
* **effacer** : effacer le mot en cours de saisie
* **vérifier** : vérifier la partie en cours
* **stop** : arrêter le microphone

En cas de non activité au niveau du microphone, l'application coupera automatiquement la captation du microphone au bout de 30s.

### Synthèse vocale

En activant le **mode echo**, vous activerez un système de synthèse vocale pour vous tenir informé de votre progression dans le jeu.

## Dictionnaires de mots

### Dictionnaires français
La liste des mots français a été récupérée depuis ce github : https://github.com/lorenbrichter/Words.

La liste des wordles français a été soigneusement constituée par mes soins :)

### Dictionnaires anglais
La liste des mots anglais a été récupérée ici : https://gist.github.com/cfreshman/cdcdf777450c5b5301e439061d29694c

La liste des wordles anglais a été récupérée ici : https://gist.github.com/cfreshman/a03ef2cba789d8cf00c08f767e0fad7b

## Sources d'inspiration

* [Wordle](https://www.nytimes.com/games/wordle/index.html), jeu original par ([@powerlanguish](https://twitter.com/powerlanguish)),
* [Le Mot](https://wordle.louan.me/), clone en français par Louan Bengmah ([@louanben](https://twitter.com/louanben)),
* [MOTDLE](https://motdle.herokuapp.com/), clone en français avec prise en compte des caractères accentués crée par Renaud Bédard ([@renaudbedard](https://twitter.com/louanben/renaudbedard)).

## Ressources utilisées

### Sons

* `bong_001.ogg` du [paquet de sons d'interface](https://www.kenney.nl/assets/interface-sounds) par [Kenney](https://www.kenney.nl/)
* `drop_002.ogg` du [paquet de sons d'interface](https://www.kenney.nl/assets/interface-sounds) par [Kenney](https://www.kenney.nl/)
* `error_006.ogg` du [paquet de sons d'interface](https://www.kenney.nl/assets/interface-sounds) par [Kenney](https://www.kenney.nl/)
* `message_006.ogg` du [paquet de sons d'interface](https://www.kenney.nl/assets/interface-sounds) par [Kenney](https://www.kenney.nl/)
* `switch_003.ogg` du [paquet de sons d'interface](https://www.kenney.nl/assets/interface-sounds) par [Kenney](https://www.kenney.nl/)
* `jingles_SAX07.ogg` du [paquet de jingles musicaux](https://www.kenney.nl/assets/music-jingles) par [Kenney](https://www.kenney.nl/)
* `jingles_SAX10.ogg` du [paquet de jingles musicaux](https://www.kenney.nl/assets/music-jingles) par [Kenney](https://www.kenney.nl/)
* `jingles_STEEL00.ogg` du [paquet de jingles musicaux](https://www.kenney.nl/assets/music-jingles) par [Kenney](https://www.kenney.nl/)
* `jingles_STEEL16.ogg` du [paquet de jingles musicaux](https://www.kenney.nl/assets/music-jingles) par [Kenney](https://www.kenney.nl/)
