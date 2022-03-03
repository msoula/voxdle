function createWordElement(word, evaluation) {
    let example = document.createElement('div');
    example.className = 'grid';

    let row = document.createElement('div');
    row.className = 'row';
    for (let idx = 0; idx < word.length; ++idx) {
        let validity = evaluation[idx];

        let letterBox = document.createElement('div');
        letterBox.className = 'letter-box disable-select';
        if (-1 < validity) {
            letterBox.classList.add(2 === validity ? 'correct' :
                1 === validity ? 'present' : 'absent');
        } else {
            letterBox.classList.add('active');
        }


        let letter = document.createElement('div');
        letter.className = 'letter disable-select';
        letter.textContent = word.slice(idx, idx + 1);
        letterBox.appendChild(letter);
        row.appendChild(letterBox);
    }
    example.appendChild(row);

    return example;
}

function appendVocalInstructions(parentNode, howTo) {
    let paragraph = document.createElement('h3');
    paragraph.innerHTML = howTo.commandsTitle;
    parentNode.appendChild(paragraph);

    paragraph = document.createElement('ul');
    howTo.commands.forEach(command => {
        paragraph.innerHTML += `<li><i class="fas fa-volume-up"></i>&nbsp;${command}</li>`;
    });
    parentNode.appendChild(paragraph);
}

function appendExampleInstructions(parentNode, example) {
    parentNode.appendChild(createWordElement(example.word, example.evaluation));

    let paragraph = document.createElement('p');
    paragraph.innerHTML = example.text;
    parentNode.appendChild(paragraph);
}

export default {

    build: (locale) => {
        const dico = locale.help;

        let modal = document.createElement('div');
        modal.className = 'modal help';

        let content = document.createElement('div');
        content.className = 'modal-content';

        // header
        let header = document.createElement('div');
        header.className = 'modal-header';
        let title = document.createElement('h1');
        title.textContent = dico.title;
        header.appendChild(title);
        let close = document.createElement('button');
        close.ariaLabel = locale.accessibility.close;
        close.className = 'close';
        close.innerHTML = '<i aria-hidden="true" class="fas fa-times"></i>';
        header.appendChild(close);
        close.onclick = () => modal.remove();
        content.appendChild(header);

        let body = document.createElement('div');
        body.className = 'modal-body';

        // intro
        let paragraph = document.createElement('p');
        paragraph.innerHTML = dico.intro;
        body.appendChild(paragraph);

        body.appendChild(document.createElement('hr'));

        // how to
        paragraph = document.createElement('p');
        paragraph.innerHTML = dico.howTo.firstPart;
        body.appendChild(paragraph);

        appendVocalInstructions(body, dico.howTo);

        paragraph = document.createElement('p');
        paragraph.innerHTML = dico.howTo.lastPart;
        body.appendChild(paragraph);

        body.appendChild(document.createElement('hr'));

        appendExampleInstructions(body, dico.examples.correct);
        appendExampleInstructions(body, dico.examples.present);
        appendExampleInstructions(body, dico.examples.absent);
        content.appendChild(body);

        modal.appendChild(content);
        modal.style.display = 'block';

        return modal;
    },

    buildMicro(locale) {
        const dico = locale.help;

        let modal = document.createElement('div');
        modal.className = 'modal help';

        let content = document.createElement('div');
        content.className = 'modal-content';

        let body = document.createElement('div');
        body.className = 'modal-body';
        appendVocalInstructions(body, dico.howTo);
        content.appendChild(body);

        modal.appendChild(content);
        modal.style.display = 'block';

        return modal;
    }

}


// vim: set ts=4 sw=4 expandtab:
