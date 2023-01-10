// Define a class for representing the portfolio
class Portfolio {
  constructor() {
    this.cryptocurrencies = new Map();
  }

  // Add a cryptocurrency to the portfolio
  addCryptocurrency(name, units) {
    if (this.cryptocurrencies.has(name)) {
      this.cryptocurrencies.set(name, this.cryptocurrencies.get(name) + units);
    } else {
      this.cryptocurrencies.set(name, units);
    }
  }

  // Remove a cryptocurrency from the portfolio
  removeCryptocurrency(name, units) {
    const currentQuantity = this.cryptocurrencies.get(name);
    this.cryptocurrencies.set(name, currentQuantity-units);

    // If there are no more units of the cryptocurrency, remove it from the portfolio
    if (this.cryptocurrencies.get(name) === 0) {
      this.cryptocurrencies.delete(name);
    }
  }
}


this.apiUrl =
  "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP,LTC,BCH,EOS,BNB,ADA,XLM,DOT&tsyms=USD";
this.form = document.getElementById("buy-sell-form");
this.sellButton = document.getElementById("sell-button");
this.currencyDropdown = document.getElementById("currency");
this.unitsInput = document.getElementById("units");
this.priceInput = document.getElementById("price");
this.totalInput = document.getElementById("total");
this.portfolioDiv = document.getElementById("portfolio");
this.balance = 10000; // Initial balance of $10,000
this.prices = {};
this.init();

// Bind event handlers
this.form.addEventListener("submit", this.handleBuy.bind(this));
this.sellButton.addEventListener("click", this.handleSell.bind(this));
this.unitsInput.addEventListener("input", this.updateTotal.bind(this));
this.currencyDropdown.addEventListener("input", this.updateTotal.bind(this));

  

async function init(){
await this.fetchPrices();

this.portfolio = new Portfolio();

  const savedPortfolioData = localStorage.getItem("portfolio");
  if (savedPortfolioData) {
        console.log(savedPortfolioData)
        const parsedData = JSON.parse(savedPortfolioData);
        this.portfolio.cryptocurrencies = new Map(parsedData);
        this.balance = JSON.parse(localStorage.balance);
        console.log(this.portfolio.cryptocurrencies)
        this.updatePortfolio();
  }

}

function savePortfolioData() {
const data = JSON.stringify(Array.from(this.portfolio.cryptocurrencies.entries()));
localStorage.setItem("portfolio", data);
localStorage.setItem("balance", JSON.stringify(this.balance));
}
  

// Fetch current prices from the API and update the UI
async function fetchPrices() {
try {
  const response = await fetch(this.apiUrl);
  const data = await response.json();
  this.prices = data;
  window.prices = this.prices;
  this.updatePrices();
  this.updateCurrencyDropdown();
} catch (error) {
  console.error(error);
}
}

// Update the prices display
function updatePrices() {
const pricesDiv = document.getElementById("prices");
let html = "";
for (const [name, price] of Object.entries(this.prices)) {
  html += `<div class="price"><b>${name}:</b> $${price.USD}</div>`;
}
pricesDiv.innerHTML = html;
}

// Update the options in the currency dropdown
function updateCurrencyDropdown() {
let html = "";
for (const name of Object.keys(this.prices)) {
  html += `<option value="${name}">${name}</option>`;
}
this.currencyDropdown.innerHTML = html;
}

// Handle the buy form submission
function handleBuy(e) {
e.preventDefault();

// Get the selected currency and units to buy
const currency = this.currencyDropdown.value;
const units = parseFloat(this.unitsInput.value);
const price = this.prices[currency].USD;
const total = units * price;

// Make sure the user has enough balance to make the purchase
if (total > this.balance) {
  alert("Insufficient balance.");
  return;
}
if (units <= 0) {
  alert("Units can not be negative or zero");
  return;
}

// Deduct the total cost from the balance
this.balance -= total;

// Add the purchased cryptocurrency to the portfolio
this.portfolio.addCryptocurrency(currency, units);
this.savePortfolioData();
// Update the UI
this.updatePortfolio();
this.clearForm();
}

// Handle the sell button click
function handleSell() {
// Get the selected currency and units to sell
const currency = this.currencyDropdown.value;
const units = parseFloat(this.unitsInput.value);


// Make sure the cryptocurrency is in the portfolio and there are enough units to sell
if (!this.portfolio.cryptocurrencies.has(currency) || units > this.portfolio.cryptocurrencies.get(currency)) {
  alert("Invalid sell request.");
  return;
}
if (units <= 0) {
  alert("Units can not be negative or zero");
  return;
}

// Calculate the total sale value and add it to the balance
const total = units * this.prices[currency].USD;
this.balance += total;

// Remove the units from the cryptocurrency in the portfolio
this.portfolio.removeCryptocurrency(currency, units);
this.savePortfolioData();
// Update the UI
this.updatePortfolio();
this.clearForm();
}

// Update the portfolio display
function updatePortfolio() {
let html = "";

for (const [name, quantity] of this.portfolio.cryptocurrencies) {
  
  html += `
      <div class="cryptocurrency">
        ${name}: ${
    quantity
  } units ($${(this.prices[name].USD * quantity).toFixed(2)}) 
      </div>
    `;
}
html += `<div id="balance">Balance: $${this.balance.toFixed(2)}</div>`;
this.portfolioDiv.innerHTML = html;
}

// Clear the form inputs
function clearForm() {
this.unitsInput.value = "";
this.updateTotal();
}

// Update the total input based on the units and price inputs
function updateTotal() {
const units = parseFloat(this.unitsInput.value);
const currency = this.currencyDropdown.value;
const price = this.prices[currency].USD;
this.totalInput.value = (units * price).toFixed(2);
this.priceInput.value = price;

}


window.Portfolio = Portfolio;
window.balance = balance;