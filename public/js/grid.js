
const VALIDITY_CLASSES = [
    'letter-box absent disable-select',
    'letter-box present disable-select',
    'letter-box correct disable-select'
];

export default class Grid {

    constructor(element, rows = 6, cols = 5) {
        this.element = element;
        this.rows    = [];

        for (var idx = 0; idx < rows; ++idx) {
            let row = document.createElement('div');
            row.className = 'row';

            for (var pos = 0; pos < cols; ++pos) {
                let letterBox = document.createElement('div');
                letterBox.className = 'letter-box disable-select';
                row.appendChild(letterBox);
            }

            element.appendChild(row);
            this.rows.push(row);
        }
    }

    init(guesses, evaluations) {
        // remove previous entries
        this.rows.forEach((row, idx) => {
            this.clear(idx);
        });

        guesses.forEach((guess, idx) => {
            for (let pos = 0; pos < guess.clean.length; ++pos) {
                this.onLetterSpelled(idx, pos, guess.clean[pos]);
            }
        });
        evaluations.forEach((evaluation, idx) => setTimeout(() => this.validate(idx, evaluation), idx*300));
    }

    onLetterCancel(idx = 0, pos = 0) {
        if (idx < 0 || this.rows.length < idx) return;

        let row = this.rows[idx];
        if (pos < 0 || row.children.length < pos) return;

        let letterBox = row.children[pos];
        if (letterBox && letterBox.firstChild) {
            letterBox.classList.remove('active');
            letterBox.firstChild.remove();
        }
    }

    onLetterSpelled(idx = 0, pos = 0, c = '') {
        if (idx < 0 || this.rows.length < idx) return;

        let row = this.rows[idx];
        if (pos < 0 || row.children.length < pos) return;

        let letterBox = row.children[pos];
        if (letterBox) {
            letterBox.classList.add('active');
            let letter = document.createElement('div');
            letter.className = 'letter active disable-select';
            letter.classList.add('letter');
            letter.textContent = c.toUpperCase();
            letterBox.appendChild(letter);
        }
    }

    onInvalidWord(idx = 0) {
        if (idx < 0 || this.rows.length < idx) return;

        let row = this.rows[idx];
        for (let pos = row.children.length - 1; 0 <= pos; --pos) {
            let letterBox = row.children[pos];
            letterBox.classList.add('invalid');
            setTimeout(() => letterBox.classList.remove('invalid'), 1000);
        }
    }

    clear(idx = 0) {
        if (idx < 0 || this.rows.length < idx) return;

        let row = this.rows[idx];
        for (let pos = row.children.length - 1; 0 <= pos; --pos) {
            let letterBox = row.children[pos];
            letterBox.className = 'letter-box disable-select';
            if (letterBox.firstChild) {
                letterBox.classList.remove('active');
                letterBox.firstChild.remove();
            }

        }
    }

    validate(idx = 0, validity = [0, 0, 0, 0, 0]) {
        if (idx < 0 || this.rows.length < idx) return;

        let row = this.rows[idx];
        if (validity.length != row.children.length) return;

        for (let pos = 0; pos < validity.length; ++pos) {

            let letterBox = row.children[pos];
            setTimeout(() => {
                letterBox.className = VALIDITY_CLASSES[validity[pos]];
            }, pos*100);
        }
    }

}
// vim: set ts=4 sw=4 expandtab:
