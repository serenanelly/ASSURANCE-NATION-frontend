describe("Page de connexion", () => {
  beforeEach(() => {
    cy.visit("/auth/login");
  });

  it("affiche le formulaire de connexion", () => {
    cy.contains("h1", "Connexion").should("be.visible");
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.contains("button", "Se connecter").should("be.visible");
  });

  it("affiche le lien vers la création de compte", () => {
    cy.contains("a", "Créer un compte")
      .should("be.visible")
      .and("have.attr", "href", "/auth/register");
  });

  it("affiche le lien mot de passe oublié", () => {
    cy.contains("a", "Mot de passe oublié ?")
      .should("be.visible")
      .and("have.attr", "href", "/auth/forgot-password");
  });

  it("valide les champs requis", () => {
    cy.contains("button", "Se connecter").click();
    cy.get('input[name="email"]:invalid').should("exist");
  });
});
