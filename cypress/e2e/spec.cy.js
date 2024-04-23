/// <reference types="cypress" />

context("Create order", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api-gateway1/mpportalgateway/api/v1/user/info").as(
      "portalGateway"
    );
    cy.visit("https://crm.internal.paradisemobile.bm/pml-crm/#/login");
    cy.get('input[placeholder="Username"]').type("devmail@paradisemobile.com"); // CRM USER EMAIL
    cy.get('input[placeholder="Password"]').type("M@tadordeCasua1"); // CRM USER PASSWORD
    cy.get("button").contains("Login").click();
    cy.wait("@portalGateway");
    cy.get("#spinner").should("not.exist");
  });

  var i = 0;
  for (i = 0; i < 29; i++) {
    it("Should add a line. Run number: " + i, () => {
      cy.wait(15000);
      cy.intercept(
        "GET",
        "**/api-gateway1/mpportalgateway/api/v1/customers?**"
      ).as("getCustomers");
      cy.intercept(
        "GET",
        "**/api-gateway1/mpportalgateway/api/v1/customerHistory?**"
      ).as("getCustomerHistory");
      cy.intercept(
        "GET",
        "**/api-gateway1/mpportalgateway/api/v1/customerDetails/**"
      ).as("getCustomerDetails");
      cy.intercept("GET", "**/api-gateway1/productCatalog/**").as(
        "getProductCatalog"
      );
      cy.intercept(
        "GET",
        "**/api-gateway1/portalgateway/api/v1/billingAccount/**"
      ).as("getBillingAccount");
      cy.intercept(
        "PATCH",
        "**/api-gateway1/portalgateway/api/v1/inventory-management/**"
      ).as("patchInventory");
      cy.intercept(
        "POST",
        "**/api-gateway1/mpportalgateway/api/v1/submitProductOrder"
      ).as("postOrder");

      cy.get(
        ".customer-border-box > .search-box-section > app-search-box > .search-box > .ng-untouched"
      ).type("100001744"); // USER ID
      cy.wait("@getCustomers");

      cy.get(".mat-row > .cdk-column-name").first().click();
      cy.wait("@getCustomerHistory");

      cy.get("div").contains("Orders").click();
      cy.wait("@getCustomerDetails");
      cy.get(".create-btn").click();

      cy.get(".content-details > .next-btn > .dropdown-btn > button").click();
      cy.wait("@getProductCatalog");

      cy.get("h1").contains("Promotional Trial").click(); // PLAN NAME
      cy.get("label").contains("Continue").click();
      cy.wait("@getBillingAccount");

      cy.get(
        ".user-lines__header > app-dropdown-button > .dropdown-btn > button > .ng-star-inserted"
      ).click();
      cy.get('input[placeholder="Select number"]').click({ force: true });
      cy.get("mat-option").first().click();
      cy.get("#eSIM").click({ force: true });
      cy.get("button").contains("Ok").click({ force: true });
      cy.wait("@patchInventory");

      cy.get("label").contains("Continue").click();
      cy.get("label").contains("Continue").click();
      cy.get("label").contains("Submit").click();
      cy.wait("@postOrder");
    });
  }
});
