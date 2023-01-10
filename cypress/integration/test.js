describe('Fetch data from API', () => {

  //Complete the class Portfolio. Create a map inside its constructor names cryptocurrencies, where key would be the name of the crypto and 
  //and the value would be the units of that crypto present in the portflio. Create two functions addCryptocurrency(name,units) and 
  // removeCryptocurrency(name, units). Name is the currency and units is the quanity. addCryptocurrency should add crypto to the map and removeCryptocurrency should 
  //remove crypto from the portfolio
  it('test the portfolio class and its function', () => { 
    cy.visit('/')
    cy.window().then(win => {
      const Portfolio = win.Portfolio;
      const obj = new Portfolio();
      obj.addCryptocurrency('BTC', 2); 
      expect(obj.cryptocurrencies.get('BTC')).to.equal(2);
      obj.removeCryptocurrency('BTC', 1);
      expect(obj.cryptocurrencies.get('BTC')).to.equal(1);
    });
  });

  //Create a init function which should be called everytime the page is loaded. The init function should fetch the prices of 10 cryptocurrencies for the api
  //https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,LTC,BCH,EOS,BNB,ADA,XLM,DOT&tsyms=USD
  //and store it in a global variable called prices. And display it in the html inside the #prices div.
  let appPrices;
  it('fetches data and compares it to stored variable', () => {
    cy.visit('/')
    let prices;
    cy.wait(2000)
    cy.window().then(win => {
      prices = win.prices;
      appPrices = prices;
    });
    cy.request('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,LTC,BCH,EOS,BNB,ADA,XLM,DOT&tsyms=USD')
      .then((response) => {
        expect(response.body).to.deep.equal(prices)
      })
  })
  
  //Create a global variable called balance which will store the amount of dollars with the user. Its value should be 10000 initally.
  //Create two global functions handleBuy(e) and handleSel(e). When the user buys crypto by clicking the #buy-button the handleBuy function should 
  //update the portfolio using the addCryptocurrency function. Similarly when the user sells crypto  by clicking the #sell-button, the handleSell(e)
  //function should update the portfolio using the removeCryptocurrency function. Both of these function should also update the global variable balance.
  //At the end, update the UI with the new portfolio data. In the #portfolio div, display the portfolio details in a list, and update the text of
  //#balance with the new balance, in the form "Balance: $10000"

  it('test buying and selling of crypto', () => {
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

  //Wheever the portfolio and the balance gets updated, store their data in the localstorage. The portforlio data must to stored in the
  //key portfolio and the balance of the user must be stored with the key balance. When the page is loaded, initlaize the portfolio and the balance
  //with the one present in the local storage if present.
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
  
  
})