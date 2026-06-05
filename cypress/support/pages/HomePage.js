class HomePage {

    validateHomePage() {

        cy.url()
            .should('include', '/home');

        cy.contains('Saldo em conta')
            .should('be.visible');

        cy.contains('TRANSFERÊNCIA')
            .should('be.visible');

        cy.contains('EXTRATO')
            .should('be.visible');

        cy.contains('Sair')
            .should('be.visible');

    }

}

export default new HomePage();