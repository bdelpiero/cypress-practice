import {build, fake} from 'test-data-bot'

const userBuilder = build('User').fields({
  username: fake(f => f.internet.userName()),
  password: fake(f => f.internet.password()),
})

describe('anonymous calculator', () => {
  it('has the right title', () => {
    cy.visit('/')
      .title()
      .should('equal', 'React Calculator')
  })

  it('can make calculations', () => {
    cy.visit('/')
      .getByText(/^1$/)
      .click()
      .getByText(/^\+$/)
      .click()
      .getByText(/^2$/)
      .click()
      .getByText(/^=$/)
      .click()
      .getByTestId('total')
      .should('have.text', '3')
  })
})

describe('registration', () => {
  it('should register a new user', () => {
    const user = userBuilder()

    cy.visit('/')
      .getByText(/register/i)
      .click()
      .getByLabelText('Username', {force: true})
      .type(user.username)
      .getByLabelText('Password')
      .type(user.password)
      .getByText(/submit/i)
      .click()
      .url()
      .should('equal', `${Cypress.config().baseUrl}/`)
      .window()
      .its('localStorage.token')
      .should('be.a', 'string')
      .getByTestId('username-display')
      .should('have.text', user.username)
  })
})
