function createInputSettingsRow(classname, label, defaultValue, forName, ariaLabelChecked, ariaLabelUnchecked) {
    let row = document.createElement('div');
    row.className = `settings-row ${classname}`;

    let htmlContent = `<div class="settings-name">${label}</div>`;
    htmlContent += `<label class="switch for="${forName}" aria-label="${defaultValue ? ariaLabelChecked : ariaLabelUnchecked}">`;
    if (defaultValue) {
        htmlContent += `<input class="${classname}-ctrl" name="${forName}" type="checkbox" checked>`;
    } else {
        htmlContent += `<input class="${classname}-ctrl" name="${forName}" type="checkbox">`;
    }
    htmlContent += '<span class="slider round"></span>';
    htmlContent += '</label>';
    htmlContent += '</div>';
    row.innerHTML = htmlContent;
    return row;
}

export default {

    build: (locale, darkMode, colorBlind, echo) => {
        const dico = locale.settings;

        let modal = document.createElement('div');
        modal.className = 'modal settings';

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

        let row;
        let htmlContent;

        row = document.createElement('div');
        row.className = 'settings-row';
        htmlContent = `<div class="settings-name">${dico.language.label}</div>`;
        htmlContent += '<div>';
        htmlContent += `<input type="button" class="nostyle lang-ctrl" aria-label="${dico.language.frAriaLabel}" value="FR" />`;
        htmlContent += `&nbsp;<input type="button" class="nostyle lang-ctrl" aria-label="${dico.language.enAriaLabel}" value="EN" />`;
        htmlContent += '</div>';
        row.innerHTML = htmlContent;
        body.appendChild(row);

        body.appendChild(
            createInputSettingsRow(
                'dark-mode',
                dico.darkMode.label,
                darkMode,
                'dark-mode',
                dico.darkMode.ariaLabelChecked,
                dico.darkMode.ariaLabelUnchecked
            )
        );

        body.appendChild(
            createInputSettingsRow(
                'color-blind',
                dico.colorBlind.label,
                colorBlind,
                'color-blind',
                dico.colorBlind.ariaLabelChecked,
                dico.colorBlind.ariaLabelUnchecked
            )
        );

        body.appendChild(
            createInputSettingsRow(
                'echo',
                dico.echo.label,
                echo,
                'echo',
                dico.echo.ariaLabelChecked,
                dico.echo.ariaLabelUnchecked
            )
        );

        row = document.createElement('div');
        row.className = 'settings-row';
        htmlContent = `<div class="settings-name">${dico.contact}</div>`;
        htmlContent += '<div>';
        htmlContent += '<a class="nostyle" href="mailto:voxdle@u2042.com" target="_blank"><i class="fas fa-envelope fa-lg"></i></a>';
        htmlContent += '&nbsp;<a class="nostyle" href="https://twitter.com/0x2042/" target="_blank"><i class="fab fa-twitter fa-lg"></i></a>';
        htmlContent += '</div>';
        row.innerHTML = htmlContent;
        body.appendChild(row);

        row = document.createElement('hr');
        body.appendChild(row);

        row = document.createElement('div');
        row.className = 'settings-row description';
        row.innerHTML += dico.credits;
        body.appendChild(row);
        content.appendChild(body);

        modal.appendChild(content);
        modal.style.display = 'block';

        return modal;
    }

}


// vim: set ts=4 sw=4 expandtab:
