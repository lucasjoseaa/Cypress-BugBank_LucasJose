class StatementPage {

    backToHome() {
        cy.contains('Voltar')
            .click({ force: true });

        cy.url()
            .should('include', '/home');
    }

    openStatement() {
        cy.get('#btn-EXTRATO')
            .click({ force: true });

        cy.url()
            .should('include', '/bank-statement');
    }

    validateStatementPage() {
        cy.url()
            .should('include', '/bank-statement');
    }

    validateTransferType() {
        cy.contains('Transferência enviada')
            .should('be.visible');
    }

    validateTransferDescription(description) {
        cy.contains(description)
            .should('be.visible');
    }

    validateTransferValue(value) {
        cy.contains(value)
            .should('be.visible');
    }
    validateBalance(expectedBalance) {

    cy.contains(expectedBalance)
        .should('be.visible');

}

}

export default new StatementPage();