// Retrieve customers from local storage or initialize an empty array
let customers = JSON.parse(localStorage.getItem('customers')) || [];

// Function to add a new customer
function addCustomer(event) {
  event.preventDefault();
  const name = $('#customer-name').val();
  const age = $('#customer-age').val();
  const email = $('#customer-email').val();
  const balance = parseFloat($('#customer-balance').val());

  // Create a new customer object with initial settings, savings, and transactions
  const customer = {
    name,
    age,
    email,
    balance,
    settings: {},
    savings: {},
    transactions: []
  };

  // Add the customer to the array
  customers.push(customer);

  // Store the updated customers array in local storage
  localStorage.setItem('customers', JSON.stringify(customers));

  // Reset the form
  $('#add-customer-form')[0].reset();

  // Redirect to index.html
  window.location.href = 'index.html';
}

// Function to redirect to add-customer.html page
function goToAddCustomerPage() {
  window.location.href = 'add-customer.html';
}

// Function to redirect to account-settings.html page
function goToAccountSettingsPage(index) {
  // Store the selected customer index in local storage
  localStorage.setItem('selectedCustomerIndex', index);

  // Redirect to account-settings.html
  window.location.href = 'account-settings.html';
}

// Function to redirect to transactions.html page
function goToTransactionsPage(index) {
  // Store the selected customer index in local storage
  localStorage.setItem('selectedCustomerIndex', index);

  // Redirect to transactions.html
  window.location.href = 'transactions.html';
}

// Function to delete a customer
function deleteCustomer(index) {
  // Confirm the deletion with the user
  if (confirm('Are you sure you want to delete this customer?')) {
    // Remove the customer from the array
    customers.splice(index, 1);

    // Store the updated customers array in local storage
    localStorage.setItem('customers', JSON.stringify(customers));

    // Update the displayed customer list
    displayCustomers();
  }
}

// Function to display customers
function displayCustomers() {
  const customerList = $('#customer-list');
  customerList.empty();

  const displayedCustomers = new Set();

  customers.forEach((customer, index) => {
    // Check if the customer has already been displayed
    if (!displayedCustomers.has(customer.name)) {
      const customerDiv = $('<div>').addClass('customer');

      const nameHeading = $('<h3>').text(customer.name);

      const ageParagraph = $('<p>').text(`Age: ${customer.age}`);

      const emailParagraph = $('<p>').text(`Email: ${customer.email}`);

      const balanceParagraph = $('<p>').text(`Balance: $${customer.balance}`);

      const accountSettingsButton = $('<button>')
        .text('Account Settings')
        .addClass('button')
        .on('click', () => {
          goToAccountSettingsPage(index);
        });

      const transactionsButton = $('<button>')
        .text('Transactions')
        .addClass('button')
        .on('click', () => {
          goToTransactionsPage(index);
        });

      const deleteButton = $('<button>')
        .text('Delete')
        .addClass('button button-danger')
        .on('click', () => {
          deleteCustomer(index);
        });

      customerDiv.append(
        nameHeading,
        ageParagraph,
        emailParagraph,
        balanceParagraph,
        accountSettingsButton,
        transactionsButton,
        deleteButton
      );

      customerList.prepend(customerDiv);

      // Add the customer's name to the displayed customers set
      displayedCustomers.add(customer.name);
    }
  });
}

// Function to display account settings for the selected customer
function displayAccountSettings() {
  const selectedCustomerIndex = localStorage.getItem('selectedCustomerIndex');

  if (selectedCustomerIndex !== null) {
    const selectedCustomer = customers[selectedCustomerIndex];
    const accountSettingsSection = $('#account-settings');

    // Clear the existing content
    accountSettingsSection.empty();

    // Create the account settings HTML
    const accountSettingsHTML = `
      <h2>Account Settings - ${selectedCustomer.name}</h2>
      <p>Age: ${selectedCustomer.age}</p>
      <p>Email: ${selectedCustomer.email}</p>
      <p>Balance: $${selectedCustomer.balance}</p>
      <h3>Settings</h3>
      <p>Option 1: ${selectedCustomer.settings.option1}</p>
      <p>Option 2: ${selectedCustomer.settings.option2}</p>
      <p>Option 3: ${selectedCustomer.settings.option3}</p>
      <h3>Savings</h3>
      <p>Account 1: $${selectedCustomer.savings.account1}</p>
      <p>Account 2: $${selectedCustomer.savings.account2}</p>
      <h3>Transactions</h3>
      <ul>
        ${selectedCustomer.transactions
          .map(
            transaction => `
              <li>
                Date: ${transaction.date}, Description: ${transaction.description}, Amount: $${transaction.amount}
              </li>
            `
          )
          .join('')}
      </ul>
    `;

    // Append the account settings HTML to the section
    accountSettingsSection.append(accountSettingsHTML);
  } else {
    $('#account-settings').html('<p>No customer selected.</p>');
  }
}

// Function to display transactions for the selected customer
function displayTransactions() {
  const selectedCustomerIndex = localStorage.getItem('selectedCustomerIndex');

  if (selectedCustomerIndex !== null) {
    const selectedCustomer = customers[selectedCustomerIndex];
    const transactionsSection = $('#transactions');

    // Clear the existing content
    transactionsSection.empty();

    // Create the transactions HTML
    const transactionsHTML = `
      <h2>Transactions - ${selectedCustomer.name}</h2>
      <p>Balance: $${selectedCustomer.balance}</p>
      <h3>Transaction History</h3>
      <ul>
        ${selectedCustomer.transactions
          .map(
            transaction => `
              <li>
                Date: ${transaction.date}, Description: ${transaction.description}, Amount: $${transaction.amount}
              </li>
            `
          )
          .join('')}
      </ul>
      <h3>Make a Transfer</h3>
      <form id="transfer-form" class="form">
        <label for="transfer-amount">Amount:</label>
        <input type="number" id="transfer-amount" required>
        <label for="transfer-description">Description:</label>
        <input type="text" id="transfer-description" required>
        <button type="submit" onclick="makeTransfer(event)">Transfer</button>
      </form>
    `;

    // Append the transactions HTML to the section
    transactionsSection.append(transactionsHTML);
  } else {
    $('#transactions').html('<p>No customer selected.</p>');
  }
}

// Function to make a transfer for the selected customer
function makeTransfer(event) {
  event.preventDefault();
  const selectedCustomerIndex = localStorage.getItem('selectedCustomerIndex');
  const transferAmount = parseFloat($('#transfer-amount').val());
  const transferDescription = $('#transfer-description').val();

  if (selectedCustomerIndex !== null) {
    const selectedCustomer = customers[selectedCustomerIndex];

    // Update the customer's balance
    selectedCustomer.balance += transferAmount;

    // Add the transaction to the customer's transaction history
    const transaction = {
      date: new Date().toISOString(),
      description: transferDescription,
      amount: transferAmount
    };
    selectedCustomer.transactions.push(transaction);

    // Store the updated customers array in local storage
    localStorage.setItem('customers', JSON.stringify(customers));

    // Display the updated transactions
    displayTransactions();
  }
}

// Add event listener to the "Add New Customer" button
$('#add-customer-button').on('click', goToAddCustomerPage);

// Display customers on page load
displayCustomers();

// Check the current page and display account settings or transactions if a selected customer index is available
const currentLocation = window.location.href;

if (currentLocation.includes('account-settings.html')) {
  displayAccountSettings();
} else if (currentLocation.includes('transactions.html')) {
  displayTransactions();
}

// exercises for Module 4 
//Retrieve or Initialize Customers:

//Retrieve the customers array from local storage using localStorage.getItem('customers').
//Parse the stored JSON data into a JavaScript array using JSON.parse().
//If the customers array is not present, initialize it as an empty array.
//Function to Add a New Customer:

//Create the addCustomer function that will be triggered when the "Add Customer" button is clicked.
//Prevent the default form submission behavior using event.preventDefault().
//Retrieve the customer details (name, age, email, and balance) from the input fields.
//Create a new customer object with initial settings, savings, and an empty transactions array.
//Add the new customer object to the customers array.
//Store the updated customers array in local storage using localStorage.setItem().
//Reset the form using $('#add-customer-form')[0].reset().
//Redirect the user to the index.html page using window.location.href.
//Functions to Redirect to Different Pages:

//Create the goToAddCustomerPage function to redirect the user to the add-customer.html page.
//Create the goToAccountSettingsPage(index) function to redirect the user to the account-settings.html page and store the selected customer's index in local storage.
//Create the goToTransactionsPage(index) function to redirect the user to the transactions.html page and store the selected customer's index in local storage.
//Function to Delete a Customer:

//Create the deleteCustomer(index) function that will be triggered when the "Delete" button is clicked for a customer.
//Use the confirm function to ask the user for confirmation before deleting the customer.
//If the user confirms, remove the customer from the customers array using splice.
//Store the updated customers array in local storage using localStorage.setItem().
//Update the displayed customer list by calling the displayCustomers function.
//Function to Display Customers:

//Create the displayCustomers() function to show the list of customers in the "customer-list" section.
//Use jQuery to manipulate the DOM and create the necessary elements to display each customer's information.
//Check if a customer has already been displayed to avoid duplicates using a Set.
//Add event listeners to the buttons within each customer element to handle redirection and deletion.
//Functions to Display Account Settings and Transactions:


//Exercises for Module 5

//Create the displayAccountSettings() function to show the account settings of the selected customer in the "account-settings" section.
//Create the displayTransactions() function to display the transaction history of the selected customer in the "transactions" section.
//Retrieve the selected customer index from local storage.
//Retrieve the selected customer object from the customers array based on the index.
//Use jQuery to manipulate the DOM and display the account settings or transaction details.
//Function to Make a Transfer:

//Create the makeTransfer(event) function that will be triggered when the user submits the transfer form on the transactions page.
//Prevent the default form submission behavior using event.preventDefault().
//Retrieve the transfer amount and description from the input fields.
//Update the customer's balance and add the transaction to the customer's transaction history.
//Store the updated customers array in local storage using localStorage.setItem().
//Display the updated transactions by calling the displayTransactions function.
//Add Event Listener and Initial Function Calls:

//Add an event listener to the "Add New Customer" button with the ID add-customer-button.
//Call the goToAddCustomerPage function when the button is clicked.
//Display the list of customers on page load by calling the displayCustomers function.
//Check the current page's URL and display either account settings or transactions if a selected customer index is available.
//Add Jquery 