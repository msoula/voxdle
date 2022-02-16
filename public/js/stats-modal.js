export default {

    build: (locale, wordle, callback) => {
        const dico = locale.stats;

        let modal = document.createElement('div');
        modal.className = 'modal stats';

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

        // body
        let body = document.createElement('div');
        body.className = 'modal-body';

        let paragraph;

        if (wordle) {
            paragraph = document.createElement('p');
            paragraph.innerHTML = dico.intro + '<br/>';
            paragraph.innerHTML += `<a href="${dico.formatDictionaryLink(wordle)}" target="_blank" class="definition nostyle"><i class="fas fa-book"></i></a>&nbsp;<span class="wordle">${wordle.toUpperCase()}</span>`;
            body.appendChild(paragraph);

            if (callback) {
                let button = document.createElement('button');
                button.className = 'share';
                button.innerHTML = '<i class="fas fa-share-alt"></i>&nbsp;' + dico.share;
                body.appendChild(button);
                button.onclick = callback;
            }
        }

        paragraph = document.createElement('p');
        paragraph.innerHTML = dico.nextWordle + '<br/>';
        let span = document.createElement('span');
        span.className = 'countdown';
        paragraph.appendChild(span);
        body.appendChild(paragraph);
        content.appendChild(body);

        modal.appendChild(content);
        modal.style.display = 'block';

        return modal;
    },

    updateCountdown: (modal, time) => {
        let spans = modal.getElementsByClassName('countdown');
        if (spans.length) {
            time /= 1000;

            let span = spans[0];

            let hours = 0 | time/60/60;
            let minutes = 0 | (time - hours*60*60)/60;
            let seconds = 0 | (time - hours*60*60 - minutes*60);

            span.textContent = `${('00' + hours).slice(-2)}:${('00' + minutes).slice(-2)}:${('00' + seconds).slice(-2)}`;
        }
    }

}


// vim: set ts=4 sw=4 expandtab:
