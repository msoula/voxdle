const CONFIRM = 'CONFIRM';
const CANCEL = 'CANCEL';
const CHECK = 'CHECK';
const RESET = 'RESET';
const STOP = 'STOP';

export const Locales = {
    CONFIRM,
    CANCEL,
    CHECK,
    RESET,
    STOP,

    en: {
        locale: 'en-US',
        keyboard: [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            [CONFIRM, 'z', 'x', 'c', 'v', 'b', 'n', 'm', CANCEL],
        ],
        language: {
            letters: [
                ['a'],
                ['b', 'be', 'bee'],
                ['c', 'see', 'sea'],
                ['d'],
                ['e'],
                ['f', 'have'],
                ['g', 'gee'],
                ['h'],
                ['i', 'eye', 'aye'],
                ['j', 'jay', 'jail'],
                ['k', 'cay'],
                ['l', 'el', 'well'],
                ['m', 'am', 'em'],
                ['n', 'and', 'an', 'en'],
                ['o', 'oh', 'owe'],
                ['p', 'pea', 'pee'],
                ['q', 'cue', 'queue'],
                ['r', 'are', 'ar', 'arr'],
                ['s', 'is'],
                ['t', 'tea', 'tee'],
                ['u', 'you', 'ewe', 'yew'],
                ['v'],
                ['w'],
                ['x', 'ex', 'eggs'],
                ['y', 'why'],
                ['z', 'said'],
            ],
            spellingPrefix: 'letter',
            cancel: ['correct', 'cancel'],
            check: ['check'],
            confirm: ['confirm', 'validate'],
            reset: ['erase'],
            stop: ['stop'],
        },
        phonetics: {
            'a': 'a',
            'b': 'b',
            'c': 'c',
            'd': 'd',
            'e': 'e',
            'f': 'f',
            'g': 'g',
            'h': 'h',
            'i': 'I',
            'j': 'j',
            'k': 'k',
            'l': 'l',
            'm': 'm',
            'n': 'n',
            'o': 'o',
            'p': 'p',
            'q': 'q',
            'r': 'r',
            's': 's',
            't': 't',
            'u': 'u',
            'v': 'v',
            'w': 'w',
            'x': 'x',
            'y': 'y',
            'z': 'z',
        },

        accessibility: {
            cancel: 'Cancel',
            close: 'Close',
            confirm: 'Confirm',
            help: 'Help',
            settings: 'Settings',
            stats: 'Statistics',
            turnOffMic: 'Turn off microphone',
            turnOnMic: 'Turn on microphone',
            formatAddLetter: (letter) => `Add letter ${letter}`
        },
        tts: {
            cancel: 'cancel',
            erase: 'erase',
            recogFailed: 'No letter recognized',
            tooManyLetters: 'No more letter allowed',
            micTurnOn: 'Mic turned on',
            micTurnOff: 'Mic turned off',
            tries: ['First try', 'Second try', 'Third try', 'Fourth try', 'Fifth try', 'Last try'],
            lettersCurrentlySpelled: 'The word currently entered is spelled with~',
            playTime: 'Your turn!',
            starting: 'The game has just started. Your turn !',
            formatFailure : (word) => `Too bad! You didn't guessed the word ~${word}! See you tomorrow to play again.`,
            formatSuccess : (word) => `Well done ! You've guessed the word ~${word}! See you tomorrow to play again`,
            formatWord: (word) => `The word is ~${word}~.`,
            formatLetterSpell: (letter) => `The letter ${letter}.~`,
            formatLetterSpellAndEval: (letter, validity) => `The letter ${letter} is ${2 === validity ? 'correct' : 1 === validity ? 'present' : 'absent'}.~`,
            unknownWord: 'This word is unknown.'
        },

        title: 'Voxdle, Wordle with your own voice!',
        help: {
            title: 'How to play?',
            intro: `
To play <u>voxdle</u> is to <a class="nostyle" target="_blank" href="https://www.powerlanguage.co.uk/wordle/">play Wordle</a>, but with your own voice.<br/><br/>
The goal is to guess the WORDLE of the day in 6 tries.<br/><br/>
Each try consists in spelling an existing 5-letters word.<br/>
The color of the tiles will change each time in order to let you know how close you are to find the WORDLE of the day.
`,
            howTo: {
                firstPart: `To play Voxdle with your voice*, you'll have to enable the microphone by clicking on <i class="fas fa-microphone"></i> in the upper part of the play screen.`,
                commandsTitle: `Known vocal commands`,
                commands: [
                    '<b>the letter W</b> : <i>add a new letter W</i>',
                    '<b>confirm</b> (or <b>validate</b>) : <i>validate the current guess</i>',
                    '<b>correct</b> (or <b>cancel</b>) : <i>correct the last letter entered</i>',
                    '<b>reset</b> : <i>clear the letters</i>',
                    '<b>check</b> : <i>check the game</i>',
                    '<b>stop</b> : <i>stop the microphone</i>',
                ],
                lastPart: `* <i>Not all browsers are compatible with the voice recognition feature. It seems that only Chrome, Edge and Safari are compatible so far.</i>`
            },
            examples: {
                correct: {
                    word: 'THINK',
                    evaluation: [-1, -1, -1, -1, 2],
                    text: 'The WORDLE has a letter <span class="correct"><b>K</b></span> in last position.'
                },
                present: {
                    word: 'HEART',
                    evaluation: [-1, -1, 1, -1, -1],
                    text: 'The WORDLE has a letter <span class="present"><b>A</b></span> but not in the middle position.'
                },
                absent: {
                    word: 'CYCLE',
                    evaluation: [-1, 0, -1, -1, -1],
                    text: 'The letter <span class="absent"><b>Y</b></span> is nowhere to be found in the WORDLE.'
                }
            }
        },
        settings: {
            title: 'Settings',
            darkMode: {
                label: 'Dark mode',
                ariaLabelChecked: 'Toggle light mode',
                ariaLabelUnchecked: 'Toggle dark mode',
            },
            colorBlind: {
                label: 'Color blind',
                ariaLabelChecked: 'Toggle original colors mode',
                ariaLabelUnchecked: 'Toggle color blind mode',
            },
            echo: {
                label: 'Echo mode',
                ariaLabelChecked: 'Disable echo mode',
                ariaLabelUnchecked: 'Enable echo mode',
            },
            contact: 'Contact',
            credits: `
<p>
This application is a clone of Wordle from <a class="nostyle" href="https://twitter.com/powerlanguish/" target="_blank">@powerlanguish</a> (Josh Wardle).
</p>
<p>
Among every existing versions of WORDLE, we'd like to mention :<br/><b>Le Mot</b> by <a class="nostyle" href="https://twitter.com/louanben/" target="_blank">@louanben</a> (Louan Bengmah),<br/><b>MOTDLE</b> by <a class="nostyle" href="https://twitter.com/renaudbedard/" target="_blank">@renaudbedard</a> (Renaud Bédard).
</p>
<p>
Game created by <a class="nostyle" href="https://twitter.com/ridmsoula/" target="_blank">@rid</a>, Studio Arecibo @ <a class="nostyle" href="https://u2042.com/" target="_blank">u2042</a>
</p>`,
            language: {
                label: 'Language',
                frAriaLabel: 'Play in French',
                enAriaLabel: 'Play in English',
            }
        },
        snacks: {
            gameOver: '<h3>Game over</h3><p>See you tomorrow to play again !</p>',
            micDisable: 'Speech recognition is not available on your browser :(',
            micTurnOff: '<h3>Mic turned off</h3>',
            sharedClipboard: 'Copied to the clipboard',
            unknownWord: 'This word is unknown',
        },
        stats: {
            title: 'Statistics',
            intro: 'Today\'s WORDLE was',
            share: 'Share',
            shared: 'Copied',
            nextWordle: 'Next WORDLE',
            formatDictionaryLink: (word) => `https://en.wiktionary.org/wiki/${word}`
        }
    },
    fr: {
        locale: 'fr-FR',
        keyboard: [
            ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
            [CONFIRM, 'w', 'x', 'c', 'v', 'b', 'n', CANCEL],
        ],
        language: {
            letters: [
                ['a', 'à', 'ah', 'ha'],
                ['b'],
                ['c', 'c\'est'],
                ['d', 'des'],
                ['e', 'eux', 'et', 'est'],
                ['f'],
                ['g', 'j\'ai'],
                ['h', 'hache'],
                ['i'],
                ['j', 'j\'y'],
                ['k', 'cas', 'qu\'à'],
                ['l', 'aile'],
                ['m', 'aime'],
                ['n', 'haine'],
                ['o', 'au', 'aux'],
                ['p', 'paix', 'pet'],
                ['q'],
                ['r', 'air', 'aire'],
                ['s'],
                ['t', 'te'],
                ['u', 'eut', 'eu', 'eue'],
                ['v', 'vais'],
                ['w'],
                ['x'],
                ['y'],
                ['z'],
            ],
            spellingPrefix: 'lettre',
            cancel: ['corriger', 'corrigé', 'corrigés', 'annuler', 'annulé', 'annulés'],
            check: ['vérifier', 'vérifié', 'vérifiés'],
            confirm: ['confirmer', 'confirmé', 'confirmés', 'valider', 'validé', 'validés'],
            reset: ['effacer', 'effacé', 'effacés'],
            stop: ['stop'],
        },
        phonetics: {
            'a': 'ah',
            'b': 'bée',
            'c': 'c\'est',
            'd': 'dé',
            'e': 'euh',
            'f': 'f',
            'g': 'j\'ai',
            'h': 'hache',
            'i': '! I',
            'j': 'j',
            'k': 'cas',
            'l': 'l',
            'm': 'm',
            'n': 'n',
            'o': 'oh',
            'p': 'p',
            'q': 'q',
            'r': 'r',
            's': 's',
            't': 't',
            'u': '! hue',
            'v': 'v',
            'w': 'w',
            'x': 'x',
            'y': 'I grec',
            'z': 'z',
        },

        accessibility: {
            cancel: 'Annuler',
            close: 'Fermer',
            confirm: 'Valider',
            help: 'Aide',
            settings: 'Paramètres',
            stats: 'Statistiques',
            turnOffMic: 'Éteindre le micro',
            turnOnMic: 'Allumer le micro',
            formatAddLetter: (letter) => `Ajouter la lettre ${letter}`
        },
        tts: {
            cancel: 'corrigé',
            erase: 'effacé',
            recogFailed: 'Aucune lettre reconnue',
            tooManyLetters: 'Nombre maximum de lettres atteint',
            micTurnOn: 'Micro ouvert',
            micTurnOff: 'Micro fermé',
            tries: ['Premier essai', 'Deuxième essai', 'Troisième essai', 'Quatrième essai', 'Cinquième essai', 'Dernier essai'],
            lettersCurrentlySpelled: 'Le mot en cours de saisie est composé de~',
            playTime: 'À vous de jouer !',
            starting: 'La partie vient de démarrer. À vous de jouer !',
            formatFailure : (word) => `Dommage ! Vous n'avez pas réussi à trouver le mot ~${word}! À demain pour une nouvelle partie.`,
            formatSuccess : (word) => `Bien joué ! Vous avez trouvé le mot ~${word}! À demain pour une nouvelle partie`,
            formatWord: (word) => `Le mot est ~${word}~.`,
            formatLetterSpell: (letter) => `La lettre ${letter}.~`,
            formatLetterSpellAndEval: (letter, validity) => `La lettre ${letter} est ${2 === validity ? 'Correcte' : 1 === validity ? 'Présente' : 'Absente'}.~`,
            unknownWord: 'Ce mot est inconnu.'
        },

        title: 'Voxdle, Wordle avec la voix !',
        help: {
            title: 'Comment jouer ?',
            intro: `
Jouer à <u>voxdle</u> c'est <a class="nostyle" target="_blank" href="https://www.powerlanguage.co.uk/wordle/">jouer à Wordle</a> avec sa voix.<br/><br/>
L'objectif consiste à deviner le WORDLE du jour en 6 essais.<br/><br/>
Chaque essai consiste à proposer un mot existant de 5 lettres.<br/>
À chaque essai, les cases changeront de couleur afin de vous indiquer à quel point vous êtes proches de découvrir le WORDLE du jour.
`,
            howTo: {
                firstPart: `Pour jouer à Voxdle avec votre voix*, vous devrez activer le microphone en cliquant sur <i class="fas fa-microphone"></i> dans la partie haute de l'écran de jeu.`,
                commandsTitle: `Commandes vocales reconnues`,
                commands: [
                    '<b>la lettre W</b> : <i>ajouter une nouvelle lettre W</i>',
                    '<b>confirmer</b> (ou <b>valider</b>) : <i>valider le mot saisi</i>',
                    '<b>corriger</b> (ou <b>annuler</b>) : <i>corriger la saisie</i>',
                    '<b>effacer</b> : <i>effacer le mot en cours de saisie</i>',
                    '<b>vérifier</b> : <i>vérifier la partie en cours</i>',
                    '<b>stop</b> : <i>arrêter le microphone</i>',
                ],
                lastPart: `* <i>Tous les navigateurs ne sont pas compatibles avec la fonctionnalité de reconnaissance vocale. À notre connaissance, seuls Chrome et Safari proposent cette fonctionnalité.</i>`
            },
            examples: {
                correct: {
                    word: 'MERCI',
                    evaluation: [2, -1, -1, -1, -1],
                    text: 'Le WORDLE à trouver a bien une lettre <span class="correct"><b>M</b></span> à cette position.'
                },
                present: {
                    word: 'TOILE',
                    evaluation: [-1, -1, -1, 1, -1],
                    text: 'Le WORDLE à trouver a bien une lettre <span class="present"><b>L</b></span> mais pas à cette position.'
                },
                absent: {
                    word: 'CYCLE',
                    evaluation: [-1, 0, -1, -1, -1],
                    text: 'Le WORDLE à trouver ne possède pas de lettre <span class="absent"><b>Y</b></span>.'
                }
            }
        },
        settings: {
            title: 'Paramètres',
            darkMode: {
                label: 'Mode sombre',
                ariaLabelChecked: 'Activer le mode clair',
                ariaLabelUnchecked: 'Activer le mode sombre',
            },
            colorBlind: {
                label: 'Mode daltonien',
                ariaLabelChecked: 'Activer le mode original',
                ariaLabelUnchecked: 'Activer le mode daltonien',
            },
            echo: {
                label: 'Mode echo',
                ariaLabelChecked: 'Désactiver le mode echo',
                ariaLabelUnchecked: 'Activer le mode echo',
            },
            contact: 'Contact',
            credits: `
<p>
Cette application reprend le concept original de Wordle créé par <a class="nostyle" href="https://twitter.com/powerlanguish/" target="_blank">@powerlanguish</a> (Josh Wardle).
</p>
<p>
Parmi les autres sources d'inspiration, nous souhaitons aussi faire mention de :<br/><b>Le Mot</b> par <a class="nostyle" href="https://twitter.com/louanben/" target="_blank">@louanben</a> (Louan Bengmah),<br/><b>MOTDLE</b> par <a class="nostyle" href="https://twitter.com/renaudbedard/" target="_blank">@renaudbedard</a> (Renaud Bédard).
</p>
<p>
Jeu développé par <a class="nostyle" href="https://twitter.com/ridmsoula/" target="_blank">@rid</a>, Studio Arecibo @ <a class="nostyle" href="https://u2042.com/" target="_blank">u2042</a>
</p>`,
            language: {
                label: 'Langue',
                frAriaLabel: 'Jouer en français',
                enAriaLabel: 'Jouer en anglais',
            }
        },
        snacks: {
            gameOver: '<h3>Partie terminée</h3><p>À demain pour un nouveau WORDLE !</p>',
            micDisable: 'Microphone non pris en charge par votre navigateur :(',
            micTurnOff: '<h3>Micro fermé</h3>',
            sharedClipboard: 'Copié dans le presse-papiers',
            unknownWord: 'Ce mot est inconnu',
        },
        stats: {
            title: 'Statistiques',
            intro: 'Le WORDLE du jour était',
            share: 'Partager',
            shared: 'Copié',
            nextWordle: 'Prochain WORDLE',
            formatDictionaryLink: (word) => `https://fr.wiktionary.org/wiki/${word}`
        }
    }
};

// vim: set ts=4 sw=4 expandtab:
