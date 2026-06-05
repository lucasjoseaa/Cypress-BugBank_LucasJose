import RegisterPage from '../support/pages/RegisterPage';
import LoginPage from '../support/pages/LoginPage';
import TransferPage from '../support/pages/TransferPage';

describe('Transferência', () => {

    it('TC-BB-009 - Transferência com sucesso', () => {

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

        cy.url()
            .should('include', '/home');

        // =========================
        // CAPTURA CONTA B
        // =========================

        cy.get('#textAccountNumber')
            .invoke('text')
            .then((text) => {

                const account = text
                    .replace('Conta digital:', '')
                    .trim();

                const parts = account.split('-');

                cy.wrap(parts[0].trim())
                    .as('accountNumber');

                cy.wrap(parts[1].trim())
                    .as('digit');

                cy.log(`Conta: ${parts[0]}`);
                cy.log(`Digito: ${parts[1]}`);

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

        cy.url()
            .should('include', '/home');

        // =========================
        // ACESSA TRANSFERÊNCIA
        // =========================

        cy.visit('/transfer');

        cy.url()
            .should('include', '/transfer');

        // =========================
        // TRANSFERÊNCIA
        // =========================

        cy.get('@accountNumber').then((accountNumber) => {

            cy.get('@digit').then((digit) => {

                TransferPage.fillAccountNumber(accountNumber);

                TransferPage.fillDigit(digit);

                TransferPage.fillValue('10');

                TransferPage.fillDescription('Transferencia Cypress');

                TransferPage.submitTransfer();

            });

        });

        // =========================
        // VALIDAÇÃO
        // =========================

        TransferPage.validateTransferSuccess();

    });

    it('TC-BB-010 - Transferência com saldo insuficiente', () => {

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

        cy.url()
            .should('include', '/home');

        // =========================
        // CAPTURA CONTA B
        // =========================

        cy.get('#textAccountNumber')
            .invoke('text')
            .then((text) => {

                const account = text
                    .replace('Conta digital:', '')
                    .trim();

                const parts = account.split('-');

                cy.wrap(parts[0].trim())
                    .as('accountNumber');

                cy.wrap(parts[1].trim())
                    .as('digit');

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

        cy.url()
            .should('include', '/home');

        // =========================
        // ACESSA TRANSFERÊNCIA
        // =========================

        cy.visit('/transfer');

        cy.url()
            .should('include', '/transfer');

        // =========================
        // TRANSFERÊNCIA
        // =========================

        cy.get('@accountNumber').then((accountNumber) => {

            cy.get('@digit').then((digit) => {

                TransferPage.fillAccountNumber(accountNumber);

                TransferPage.fillDigit(digit);

                TransferPage.fillValue('2000');

                TransferPage.fillDescription('Transferencia sem saldo');

                TransferPage.submitTransfer();

            });

        });

        // =========================
        // VALIDAÇÃO
        // =========================

        cy.get('#modalText')
            .should(
                'contain',
                'Você não tem saldo suficiente para essa transação'
            );

    });

    it('TC-BB-011 - Transferência para conta inexistente', () => {

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

        cy.url()
            .should('include', '/home');

        // =========================
        // TRANSFERÊNCIA
        // =========================

        cy.visit('/transfer');

        TransferPage.fillAccountNumber('9999');

        TransferPage.fillDigit('9');

        TransferPage.fillValue('10');

        TransferPage.fillDescription('Conta inexistente');

        TransferPage.submitTransfer();

        // =========================
        // VALIDAÇÃO
        // =========================

        cy.get('#modalText')
            .should(
                'contain',
                'Conta inválida ou inexistente'
            );

    });

    it('TC-BB-012 - Transferência com valor igual a zero', () => {

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

    let accountNumber;
    let digit;

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
        .invoke('text')
        .then((account) => {

            const parts = account.trim().split('-');

            accountNumber = parts[0];
            digit = parts[1];

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
    // TRANSFERÊNCIA COM VALOR ZERO
    // =========================

    cy.get('@accountNumber').then((accountNumber) => {

        cy.get('@digit').then((digit) => {

            TransferPage.fillAccountNumber(accountNumber);

            TransferPage.fillDigit(digit);

            TransferPage.fillValue('0');

            TransferPage.fillDescription('Transferencia valor zero');

            TransferPage.submitTransfer();

            // =========================
            // VALIDAÇÃO
            // =========================

            cy.get('#modalText')
                .should(
                    'contain',
                    'Valor da transferência não pode ser 0 ou negativo'
                );

        });

    });

});

it('TC-BB-013 - Transferência sem preencher conta', () => {

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

    let digit;

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
    // CAPTURA SOMENTE O DÍGITO
    // =========================

    cy.get('#textAccountNumber span')
        .invoke('text')
        .then((account) => {

            const parts = account.trim().split('-');

            digit = parts[1];

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
    // TRANSFERÊNCIA SEM CONTA
    // =========================

    cy.get('@digit').then((digit) => {

        TransferPage.fillAccountNumber('...')

        TransferPage.fillDigit(digit);

        TransferPage.fillValue('10');

        TransferPage.fillDescription('Transferencia sem conta');

        TransferPage.submitTransfer();

        // =========================
        // VALIDAÇÃO
        // =========================

        cy.get('#modalText')
            .should('contain', 'Conta inválida ou inexistente');

    });

});

it('TC-BB-014 - Transferência sem preencher valor', () => {

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

    let accountNumber;
    let digit;

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
    // TRANSFERÊNCIA SEM VALOR
    // =========================

    cy.get('@accountNumber').then((accountNumber) => {

        cy.get('@digit').then((digit) => {

            TransferPage.fillAccountNumber(accountNumber);

            TransferPage.fillDigit(digit);

            // NÃO PREENCHE O VALOR

            TransferPage.fillDescription('teste');

            TransferPage.submitTransfer();

            // =========================
            // VALIDAÇÃO
            // =========================

            cy.get('body')
                .should('contain', 'NaN');

            cy.url()
                .should('include', '/transfer');
        });
    });

});

});



