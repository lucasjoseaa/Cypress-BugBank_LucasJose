import RegisterPage from '../support/pages/RegisterPage';
import LoginPage from '../support/pages/LoginPage';
import HomePage from '../support/pages/HomePage';

it('TC-BB-005 - Login com sucesso', () => {

    const timestamp = Date.now();

    const user = {
        name: `Lucas QA ${timestamp}`,
        email: `lucas${timestamp}@qa.com`,
        password: 'Qa123456'
    };

    cy.visit('/');

    RegisterPage.registerUser(user);

    RegisterPage.closeModal();

    LoginPage.fillEmail(user.email);

    LoginPage.fillPassword(user.password);

    LoginPage.submit();

    HomePage.validateHomePage();

});

it('TC-BB-006 - Login com senha incorreta', () => {

    const timestamp = Date.now();

    const user = {
        name: `Lucas QA ${timestamp}`,
        email: `lucas${timestamp}@qa.com`,
        password: 'Qa123456'
    };

    cy.visit('/');

    RegisterPage.registerUser(user);

    RegisterPage.closeModal();

    LoginPage.fillEmail(user.email);

    LoginPage.fillPassword('SenhaErrada123');

    LoginPage.submit();

    cy.get('#modalText')
        .should('contain', 'Usuário ou senha inválido');

});

it('TC-BB-007 - Login com usuário inexistente', () => {

    cy.visit('/');

    LoginPage.fillEmail(`naoexiste${Date.now()}@qa.com`);

    LoginPage.fillPassword('Qa123456');

    LoginPage.submit();

    cy.get('#modalText')
        .should('contain', 'Usuário ou senha inválido');

});

it('TC-BB-008 - Login com campos vazios', () => {

    cy.visit('/');

    LoginPage.submit();

    cy.get('.card__login')
        .contains('É campo obrigatório');

});