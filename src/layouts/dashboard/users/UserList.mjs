const UserItem = new CjsComponent((data) => {
    const { id, username, email, role } = data;
    return `
        <div class="item">
            <div class="info">
                <span class="id">ID: ${id}</span>
                <span class="name">${username}</span>
                <span class="email">${email}</span>
                <span class="role">${role}</span>
            </div>
            <div class="actions">
                <img class="edit" data-id="${id}" src="./src/assets/svg/dashboard/edit.svg" alt="Edytuj">
                <img class="delete" data-id="${id}" src="./src/assets/svg/dashboard/delete.svg" alt="Usuń">
                <img class="promote" data-id="${id}" src="./src/assets/svg/dashboard/promote.svg" alt="Promuj">
                <img class="demote" data-id="${id}" src="./src/assets/svg/dashboard/demote.svg" alt="Degraduj">

            </div>
        </div>
    `;
});

export const UserList = new CjsComponent(() => {
    return `
           <div class="container">
    ${UserItem.render({ id: 1, username: 'Jan Kowalski', email: 'jan.kowalski@example.com', role: 'User' })}
    ${UserItem.render({ id: 2, username: 'Anna Nowak', email: 'anna.nowak@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 3, username: 'Piotr Wiśniewski', email: 'piotr.wisniewski@example.com', role: 'User' })}
    ${UserItem.render({ id: 4, username: 'Maria Zielinska', email: 'maria.zielinska@example.com', role: 'User' })}
    ${UserItem.render({ id: 5, username: 'Krzysztof Nowak', email: 'krzysztof.nowak@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 6, username: 'Paweł Jankowski', email: 'pawel.jankowski@example.com', role: 'User' })}
    ${UserItem.render({ id: 7, username: 'Zofia Kowalska', email: 'zofia.kowalska@example.com', role: 'User' })}
    ${UserItem.render({ id: 8, username: 'Tomasz Adamczak', email: 'tomasz.adamczak@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 9, username: 'Marta Kwiatkowska', email: 'marta.kwiatkowska@example.com', role: 'User' })}
    ${UserItem.render({ id: 10, username: 'Robert Zielinski', email: 'robert.zielinski@example.com', role: 'User' })}
    ${UserItem.render({ id: 11, username: 'Katarzyna Nowak', email: 'katarzyna.nowak@example.com', role: 'User' })}
    ${UserItem.render({ id: 12, username: 'Jakub Lis', email: 'jakub.lis@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 13, username: 'Olga Dąbrowska', email: 'olga.dabrowska@example.com', role: 'User' })}
    ${UserItem.render({ id: 14, username: 'Szymon Kamiński', email: 'szymon.kaminski@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 15, username: 'Ewa Wójcik', email: 'ewa.wojcik@example.com', role: 'User' })}
    ${UserItem.render({ id: 16, username: 'Maciej Nowak', email: 'maciej.nowak@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 17, username: 'Agata Kowalska', email: 'agata.kowalska@example.com', role: 'User' })}
    ${UserItem.render({ id: 18, username: 'Łukasz Wróbel', email: 'lukasz.wrobel@example.com', role: 'User' })}
    ${UserItem.render({ id: 19, username: 'Aleksandra Król', email: 'aleksandra.krol@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 20, username: 'Grzegorz Jasiński', email: 'grzegorz.jasinski@example.com', role: 'User' })}
    ${UserItem.render({ id: 21, username: 'Michał Zawisza', email: 'michal.zawisza@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 22, username: 'Monika Twardowska', email: 'monika.twardowska@example.com', role: 'User' })}
    ${UserItem.render({ id: 23, username: 'Patryk Kaczmarek', email: 'patryk.kaczmarek@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 24, username: 'Weronika Nowak', email: 'weronika.nowak@example.com', role: 'User' })}
    ${UserItem.render({ id: 25, username: 'Wojciech Kowalczyk', email: 'wojciech.kowalczyk@example.com', role: 'User' })}
    ${UserItem.render({ id: 26, username: 'Karolina Wysocka', email: 'karolina.wysocka@example.com', role: 'User' })}
    ${UserItem.render({ id: 27, username: 'Jacek Szymański', email: 'jacek.szymanski@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 28, username: 'Natalia Adamczyk', email: 'natalia.adamczyk@example.com', role: 'User' })}
    ${UserItem.render({ id: 29, username: 'Bartłomiej Kaczmarek', email: 'bartlomiej.kaczmarek@example.com', role: 'User' })}
    ${UserItem.render({ id: 30, username: 'Piotr Jasiński', email: 'piotr.jasinski@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 31, username: 'Monika Zawisza', email: 'monika.zawisza@example.com', role: 'User' })}
    ${UserItem.render({ id: 32, username: 'Seweryn Mazur', email: 'seweryn.mazur@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 33, username: 'Kamila Lis', email: 'kamila.lis@example.com', role: 'User' })}
    ${UserItem.render({ id: 34, username: 'Tadeusz Mikołajczyk', email: 'tadeusz.mikolajczyk@example.com', role: 'User' })}
    ${UserItem.render({ id: 35, username: 'Andrzej Nowak', email: 'andrzej.nowak@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 36, username: 'Zuzanna Majewska', email: 'zuzanna.majewska@example.com', role: 'User' })}
    ${UserItem.render({ id: 37, username: 'Marcin Kwiatkowski', email: 'marcin.kwiatkowski@example.com', role: 'User' })}
    ${UserItem.render({ id: 38, username: 'Aleksander Wiśniewski', email: 'aleksander.wisniewski@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 39, username: 'Iwona Król', email: 'iwona.krol@example.com', role: 'User' })}
    ${UserItem.render({ id: 40, username: 'Dariusz Zawisza', email: 'dariusz.zawisza@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 41, username: 'Sylwia Tomaszewska', email: 'sylwia.tomaszewska@example.com', role: 'User' })}
    ${UserItem.render({ id: 42, username: 'Ewelina Nowak', email: 'ewelina.nowak@example.com', role: 'User' })}
    ${UserItem.render({ id: 43, username: 'Lena Nowak', email: 'lena.nowak@example.com', role: 'User' })}
    ${UserItem.render({ id: 44, username: 'Łukasz Kowalski', email: 'lukasz.kowalski@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 45, username: 'Jolanta Wiśniewska', email: 'jolanta.wisniewska@example.com', role: 'User' })}
    ${UserItem.render({ id: 46, username: 'Krzysztof Kaczmarek', email: 'krzysztof.kaczmarek@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 47, username: 'Filip Zawisza', email: 'filip.zawisza@example.com', role: 'User' })}
    ${UserItem.render({ id: 48, username: 'Mateusz Jankowski', email: 'mateusz.jankowski@example.com', role: 'User' })}
    ${UserItem.render({ id: 49, username: 'Dorota Nowak', email: 'dorota.nowak@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 50, username: 'Maciej Kamiński', email: 'maciej.kaminski@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 51, username: 'Rafał Zielinski', email: 'rafal.zielinski@example.com', role: 'User' })}
    ${UserItem.render({ id: 52, username: 'Czesław Kwiatkowski', email: 'czeslaw.kwiatkowski@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 53, username: 'Mariusz Twardowski', email: 'mariusz.twardowski@example.com', role: 'User' })}
    ${UserItem.render({ id: 54, username: 'Gabriela Jasińska', email: 'gabriela.jasinska@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 55, username: 'Ireneusz Mikołajczyk', email: 'ireneusz.mikolajczyk@example.com', role: 'User' })}
    ${UserItem.render({ id: 56, username: 'Marek Wiśniewski', email: 'marek.wisniewski@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 57, username: 'Jacek Kowalski', email: 'jacek.kowalski@example.com', role: 'User' })}
    ${UserItem.render({ id: 58, username: 'Lucyna Kamińska', email: 'lucyna.kaminska@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 59, username: 'Robert Szymański', email: 'robert.szymanski@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 60, username: 'Anna Mikołajczyk', email: 'anna.mikolajczyk@example.com', role: 'User' })}
    ${UserItem.render({ id: 61, username: 'Jarosław Kaczmarek', email: 'jaroslaw.kaczmarek@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 62, username: 'Piotr Mazur', email: 'piotr.mazur@example.com', role: 'User' })}
    ${UserItem.render({ id: 63, username: 'Klaudia Twardowska', email: 'klaudia.twardowska@example.com', role: 'User' })}
    ${UserItem.render({ id: 64, username: 'Ludwik Zawisza', email: 'ludwik.zawisza@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 65, username: 'Kinga Adamczak', email: 'kinga.adamczak@example.com', role: 'User' })}
    ${UserItem.render({ id: 66, username: 'Ewa Kowalska', email: 'ewa.kowalska@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 67, username: 'Mateusz Mikołajczyk', email: 'mateusz.mikolajczyk@example.com', role: 'User' })}
    ${UserItem.render({ id: 68, username: 'Dorota Mikołajczyk', email: 'dorota.mikolajczyk@example.com', role: 'User' })}
    ${UserItem.render({ id: 69, username: 'Grzegorz Nowak', email: 'grzegorz.nowak@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 70, username: 'Joanna Kamińska', email: 'joanna.kaminska@example.com', role: 'User' })}
    ${UserItem.render({ id: 71, username: 'Zofia Nowak', email: 'zofia.nowak@example.com', role: 'User' })}
    ${UserItem.render({ id: 72, username: 'Agnieszka Twardowska', email: 'agnieszka.twardowska@example.com', role: 'User' })}
    ${UserItem.render({ id: 73, username: 'Maciej Jasiński', email: 'maciej.jasinski@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 74, username: 'Kamila Kowalska', email: 'kamila.kowalska@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 75, username: 'Jacek Nowak', email: 'jacek.nowak@example.com', role: 'User' })}
    ${UserItem.render({ id: 76, username: 'Agnieszka Wiśniewska', email: 'agnieszka.wisniewska@example.com', role: 'User' })}
    ${UserItem.render({ id: 77, username: 'Daria Kamińska', email: 'daria.kaminska@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 78, username: 'Janina Jasińska', email: 'janina.jasinska@example.com', role: 'User' })}
    ${UserItem.render({ id: 79, username: 'Ewa Kamińska', email: 'ewa.kaminska@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 80, username: 'Ryszard Kwiatkowski', email: 'ryszard.kwiatkowski@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 81, username: 'Piotr Kaczmarek', email: 'piotr.kaczmarek@example.com', role: 'User' })}
    ${UserItem.render({ id: 82, username: 'Sławomir Kowalski', email: 'slawomir.kowalski@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 83, username: 'Lucyna Nowak', email: 'lucyna.nowak@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 84, username: 'Alicja Zawisza', email: 'alicia.zawisza@example.com', role: 'User' })}
    ${UserItem.render({ id: 85, username: 'Katarzyna Kamińska', email: 'katarzyna.kaminska@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 86, username: 'Jerzy Kaczmarek', email: 'jerzy.kaczmarek@example.com', role: 'User' })}
    ${UserItem.render({ id: 87, username: 'Lena Jasińska', email: 'lena.jasinska@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 88, username: 'Agnieszka Szymańska', email: 'agnieszka.szymanska@example.com', role: 'User' })}
    ${UserItem.render({ id: 89, username: 'Marek Kwiatkowski', email: 'marek.kwiatkowski@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 90, username: 'Renata Kowalska', email: 'renata.kowalska@example.com', role: 'User' })}
    ${UserItem.render({ id: 91, username: 'Daniel Nowak', email: 'daniel.nowak@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 92, username: 'Zofia Lis', email: 'zofia.lis@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 93, username: 'Jerzy Tomaszewski', email: 'jerzy.tomaszewski@example.com', role: 'User' })}
    ${UserItem.render({ id: 94, username: 'Zbigniew Kwiatkowski', email: 'zbigniew.kwiatkowski@example.com', role: 'User' })}
    ${UserItem.render({ id: 95, username: 'Marzena Kowalska', email: 'marzena.kowalska@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 96, username: 'Marek Dąbrowski', email: 'marek.dabrowski@example.com', role: 'User' })}
    ${UserItem.render({ id: 97, username: 'Joanna Szymańska', email: 'joanna.szymanska@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 98, username: 'Piotr Szymański', email: 'piotr.szymanski@example.com', role: 'Admin' })}
    ${UserItem.render({ id: 99, username: 'Adam Wiśniewski', email: 'adam.wisniewski@example.com', role: 'User' })}
    ${UserItem.render({ id: 100, username: 'Wojciech Nowak', email: 'wojciech.nowak@example.com', role: 'Admin' })}
</div>

    `;
});

UserList.importStyle('./src/layouts/dashboard/users/_styles/UserList.css');
