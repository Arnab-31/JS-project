describe('Fetch data from API', () => {
  let appPrices;
  it('fetches data and compares it to stored variable', () => {
    // Define the variable to store the expected data
    cy.visit('/')
    let prices;
    cy.wait(2000)
    cy.window().then(win => {
      // the window object is now stored in the win variable
      prices = win.prices;
      appPrices = prices;
    });
    // Use cy.request() to fetch the data from the API
    cy.request('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,LTC,BCH,EOS,BNB,ADA,XLM,DOT&tsyms=USD')
      .then((response) => {
        // Use expect() to compare the data to the stored variable
        expect(response.body).to.deep.equal(prices)
      })
  })

  it('test buying crypto', () => {
    cy.visit('/')
    cy.wait(2000)
    cy.get('#currency').select('BNB');
    cy.get('#units').type(2);
    cy.get('button[type=submit]').click();
    cy.wait(100)
    cy.get('#balance').invoke('text').then((text) => {
      const balance = text.replace('Balance: $', '');
      expect(Number(balance)).to.equal(10000 - 2*appPrices['BNB'].USD);
    });

    cy.get('#currency').select('BNB');
    cy.get('#units').type(1);
    cy.get('#sell-button').click();
    cy.get('#balance').invoke('text').then((text) => {
      const balance = text.replace('Balance: $', '');
      expect(Number(balance)).to.equal(10000 - appPrices['BNB'].USD);
    });
  })

  it('verify local storage', () => {
    cy.visit('/')
    cy.wait(2000)
    cy.get('#currency').select('BNB');
    cy.get('#units').type(2);
    cy.get('button[type=submit]').click();
    cy.window().then((win) => {
      const balance = win.localStorage.getItem('balance');
      expect(Number(balance)).to.equal(10000 - 2*appPrices['BNB'].USD);
    });
  })

  it('should add a cryptocurrency to the portfolio', () => { 
    
    cy.visit('/')
    cy.get('#currency').select('ETH');
    cy.get('#units').type(2);
    cy.get('button[type=submit]').click();

    
    cy.window().then(win => {
      const Portfolio = win.portfolio;
      cy.log(typeof(Portfolio))
      const obj = new Portfolio();
      obj.addCryptocurrency('BTC', 1); 
      cy.log(obj.cryptocurrencies)
    });
  });
})