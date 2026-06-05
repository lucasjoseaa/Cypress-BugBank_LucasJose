class TransferPage {

    fillAccountNumber(accountNumber) {
        cy.get('input')
            .eq(0)
            .type(accountNumber, { force: true });
    }

    fillDigit(digit) {
        cy.get('input')
            .eq(1)
            .type(digit, { force: true });
    }

    fillValue(value) {
        cy.get('input')
            .eq(2)
            .type(value, { force: true });
    }

    fillDescription(description) {
        cy.get('input')
            .eq(3)
            .type(description, { force: true });
    }

    submitTransfer() {
        cy.contains('button', 'Transferir agora')
            .click({ force: true });
    }

    validateTransferSuccess() {
        cy.get('#modalText')
            .should('contain', 'Transferencia realizada com sucesso');
    }

    closeModal() {
        cy.get('#btnCloseModal')
            .click({ force: true });
    }

}

export default new TransferPage();