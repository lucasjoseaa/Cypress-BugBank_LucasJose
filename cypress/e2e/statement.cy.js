import RegisterPage from '../support/pages/RegisterPage';
import LoginPage from '../support/pages/LoginPage';
import TransferPage from '../support/pages/TransferPage';
import StatementPage from '../support/pages/StatementPage';

describe('Extrato', () => {

    it('TC-BB-015 - Validar registro da transferência no extrato', () => {

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
        const transferDescription = 'Transferencia Cypress';

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
                // VALIDAÇÕES
                // =========================

                StatementPage.validateStatementPage();

                StatementPage.validateTransferType();

                StatementPage.validateTransferDescription(
                    transferDescription
                );

                StatementPage.validateTransferValue(
                    '-R$ 10,00'
                );

            });

        });

    });

    it('TC-BB-016 - Validar atualização do saldo após transferência', () => {

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

    // =========================
    // CADASTRA CONTA A
    // =========================

    cy.visit('/');

    RegisterPage.registerUser(userA);

    RegisterPage.closeModal();

    // =========================
    // CADASTRA CONTA B
    // =========================

    cy.visit('/');

    RegisterPage.registerUser(userB);

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

    cy.get('#textAccountNumber')
    .should('be.visible')
    .invoke('text')
    .then((account) => {

        cy.log(account);

        const accountMatch = account.match(/(\d+)-(\d+)/);

        expect(accountMatch).to.not.be.null;

        const accountNumber = accountMatch[1];

        const digit = accountMatch[2];

        cy.wrap(accountNumber).as('accountNumber');

        cy.wrap(digit).as('digit');

        cy.log(`Conta: ${accountNumber}`);
        cy.log(`Dígito: ${digit}`);

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
    // VALIDA SALDO INICIAL
    // =========================

    cy.contains('R$ 1.000,00')
        .should('be.visible');

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
                'Teste saldo'
            );

            TransferPage.submitTransfer();

            TransferPage.validateTransferSuccess();

            TransferPage.closeModal();

            // =========================
            // VOLTA PARA HOME
            // =========================

            StatementPage.backToHome();

            // =========================
            // VALIDA SALDO FINAL
            // =========================

            cy.contains('R$ 990,00')
                .should('be.visible');

        });

    });

});

});