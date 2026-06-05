import RegisterPage from '../support/pages/RegisterPage';

describe('Cadastro', () => {

    it('TC-BB-001 - Cadastro com sucesso', () => {

        const timestamp = Date.now();

        const user = {
            name: `Lucas QA ${timestamp}`,
            email: `lucas${timestamp}@qa.com`,
            password: 'Qa123456'
        };

        cy.visit('https://bugbank.netlify.app/');

        RegisterPage.openRegisterModal();

        RegisterPage.fillEmail(user.email);
        RegisterPage.fillName(user.name);
        RegisterPage.fillPassword(user.password);
        RegisterPage.fillPasswordConfirmation(user.password);

        RegisterPage.enableBalance();

        RegisterPage.submit();

        RegisterPage
            .successMessage()
            .should('contain', 'foi criada com sucesso');

    });

    it('TC-BB-002 - Cadastro com senhas diferentes', () => {

    const timestamp = Date.now();

    const user = {
        name: `Lucas QA ${timestamp}`,
        email: `lucas${timestamp}@qa.com`
    };

    cy.visit('/');

    RegisterPage.openRegisterModal();

    RegisterPage.fillEmail(user.email);

    RegisterPage.fillName(user.name);

    RegisterPage.fillPassword('Qa123456');

    RegisterPage.fillPasswordConfirmation('Qa654321');

    RegisterPage.submit();

    RegisterPage
        .successMessage()
        .should('be.visible')
        .and('contain', 'As senhas não são iguais.');

});

it('TC-BB-003 - Cadastro com campos obrigatórios vazios', () => {

    cy.visit('/');

    RegisterPage.openRegisterModal();

    RegisterPage.submit();

    cy.get('.card__register')
        .contains('É campo obrigatório');

});

it('TC-BB-004 - Cadastro com e-mail inválido', () => {

    cy.visit('/');

    RegisterPage.openRegisterModal();

    RegisterPage.fillEmail('qa');

    RegisterPage.fillName('Lucas');

    RegisterPage.fillPassword('Qa123456');

    RegisterPage.fillPasswordConfirmation('Qa123456');

    RegisterPage.submit();

    cy.get('.card__register')
        .find('input[name="email"]')
        .then(($input) => {

            expect($input[0].checkValidity()).to.equal(false);

        });

});

});