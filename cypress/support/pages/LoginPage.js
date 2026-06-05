class LoginPage {

    loginCard() {
        return cy.get('.card__login');
    }

    fillEmail(email) {
        this.loginCard()
            .find('input[name="email"]')
            .first()
            .type(email, { force: true });
    }

    fillPassword(password) {
        this.loginCard()
            .find('input[name="password"]')
            .first()
            .type(password, { force: true });
    }

    submit() {
        this.loginCard()
            .contains('button', 'Acessar')
            .click({ force: true });
    }

    login(email, password) {
        this.fillEmail(email);
        this.fillPassword(password);
        this.submit();
    }

}

export default new LoginPage();