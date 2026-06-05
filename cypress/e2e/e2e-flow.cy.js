import RegisterPage from '../support/pages/RegisterPage';
import LoginPage from '../support/pages/LoginPage';
import TransferPage from '../support/pages/TransferPage';
import StatementPage from '../support/pages/StatementPage';

describe('Fluxos E2E', () => {

    it('TC-BB-017 - Cadastro → Login', () => {

        const timestamp = Date.now();

        const user = {
            name: `User${timestamp}`,
            email: `user${timestamp}@qa.com`,
            password: 'Qa123456'
        };

        // =========================
        // CADASTRO
        // =========================

        cy.visit('/');

        RegisterPage.registerUser(user);

        RegisterPage.successMessage()
            .should('contain', 'foi criada com sucesso');

        RegisterPage.closeModal();

        // =========================
        // LOGIN
        // =========================

        LoginPage.fillEmail(user.email);

        LoginPage.fillPassword(user.password);

        LoginPage.submit();

        // =========================
        // VALIDAÇÕES
        // =========================

        cy.url()
            .should('include', '/home');

        cy.contains(user.name)
            .should('be.visible');

        cy.get('#textAccountNumber')
            .should('be.visible');

        cy.contains('Saldo em conta')
            .should('be.visible');

    });

    

    it('TC-BB-018 - Cadastro → Login → Transferência → Extrato', () => {

    const timestamp = Date.now();

    const userA = {
        name: `UserA${timestamp}`,
        email: `userA${timestamp}@qa.com`,
        password: 'Qa123456'
    };

    const userB = {
        name: `UserB${timestamp}`,
        email: `userB${timestamp}@qa.com`,
        password: 'Qa123456'
    };

    const transferValue = '10';
    const transferDescription = 'Fluxo E2E Cypress';

    // =========================
    // CADASTRA CONTA A
    // =========================

    cy.visit('/');

    RegisterPage.registerUser(userA);

    RegisterPage.successMessage()
        .should('contain', 'foi criada com sucesso');

    RegisterPage.closeModal();

    // =========================
    // CADASTRA CONTA B
    // =========================

    cy.visit('/');

    RegisterPage.registerUser(userB);

    RegisterPage.successMessage()
        .should('contain', 'foi criada com sucesso');

    RegisterPage.closeModal();

    // =========================
    // LOGIN CONTA B
    // =========================

    LoginPage.fillEmail(userB.email);

    LoginPage.fillPassword(userB.password);

    LoginPage.submit();

    // =========================
    // CAPTURA CONTA B
    // =========================

    cy.get('#textAccountNumber span')
            .should('be.visible')
            .invoke('text')
            .then((account) => {

                const parts = account.trim().split('-');

                const accountNumber = parts[0];
                const digit = parts[1];

                cy.wrap(accountNumber).as('accountNumber');
                cy.wrap(digit).as('digit');

            });


    // =========================
    // LOGOUT
    // =========================

    cy.contains('Sair')
        .click();

    // =========================
    // LOGIN CONTA A
    // =========================

    LoginPage.fillEmail(userA.email);

    LoginPage.fillPassword(userA.password);

    LoginPage.submit();

    // =========================
    // ACESSA TRANSFERÊNCIA
    // =========================

    cy.get('#btn-TRANSFERÊNCIA')
        .click();

    cy.url()
        .should('include', '/transfer');

    // =========================
    // REALIZA TRANSFERÊNCIA
    // =========================

    cy.get('@accountNumber').then((accountNumber) => {

        cy.get('@digit').then((digit) => {

            TransferPage.fillAccountNumber(
                String(accountNumber)
            );

            TransferPage.fillDigit(
                String(digit)
            );

            TransferPage.fillValue(
                transferValue
            );

            TransferPage.fillDescription(
                transferDescription
            );

            TransferPage.submitTransfer();

            TransferPage.validateTransferSuccess();

            TransferPage.closeModal();

            // =========================
            // VOLTA PARA HOME
            // =========================

            StatementPage.backToHome();

            // =========================
            // ACESSA EXTRATO
            // =========================

            StatementPage.openStatement();

            // =========================
            // VALIDAÇÕES DO EXTRATO
            // =========================

            StatementPage.validateStatementPage();

            StatementPage.validateTransferType();

            StatementPage.validateTransferDescription(
                transferDescription
            );

            StatementPage.validateTransferValue(
                '-R$ 10,00'
            );

            // =========================
            // VOLTA PARA HOME
            // =========================

            StatementPage.backToHome();

            // =========================
            // VALIDA HOME
            // =========================

            cy.url()
                .should('include', '/home');

            cy.contains('Saldo em conta')
                .should('be.visible');

        });

    });

});
});