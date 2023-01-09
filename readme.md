# HTML CSS JS Project template

- Write tests in cypress `npx cypress open`
- When writing tests instead of using `cy.visit('/')` to visit index page like in normal frontend tests instead, 
```js
    // declare base url globally
    const base = `${Cypress.env('PROJECT_DIR')}/index.html`
    cy.visit(base)
```
