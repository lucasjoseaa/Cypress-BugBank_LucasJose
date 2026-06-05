class RegisterPage {

    registerCard() {
        return cy.get('.card__register');
    }

    openRegisterModal() {
        cy.contains('button', 'Registrar').click();
    }

    fillEmail(email) {
        this.registerCard()
            .find('input[name="email"]')
            .type(email, { force: true });
    }

    fillName(name) {
        this.registerCard()
            .find('input[name="name"]')
            .type(name, { force: true });
    }

    fillPassword(password) {
        this.registerCard()
            .find('input[name="password"]')
            .type(password, { force: true });
    }

    fillPasswordConfirmation(password) {
        this.registerCard()
            .find('input[name="passwordConfirmation"]')
            .type(password, { force: true });
    }

    enableBalance() {
        cy.get('#toggleAddBalance')
            .click({ force: true });
    }

    submit() {
        cy.contains('button', 'Cadastrar')
            .click({ force: true });
    }

    successMessage() {
        return cy.get('#modalText');
    }

    closeModal() {
        cy.get('#btnCloseModal')
            .click();
    }

    registerUser(user) {

        this.openRegisterModal();

        this.fillEmail(user.email);

        this.fillName(user.name);

        this.fillPassword(user.password);

        this.fillPasswordConfirmation(user.password);

        this.enableBalance();

        this.submit();
    }

}

export default new RegisterPage();