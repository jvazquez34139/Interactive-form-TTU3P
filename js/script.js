document.addEventListener('DOMContentLoaded', () => {

  //html elements to manipulate
  const form = document.getElementsByTagName('form')[0];
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('mail');
  const jobTitle = document.getElementById('title');
  const otherJobRole = document.getElementById('other-title');
  const theme = document.getElementById('design');
  const colors = document.getElementById('color');
  const activityField = document.getElementsByClassName('activities')[0];
  const activities = document.querySelectorAll("label input");
  const cost = document.createElement('h2');
  const payment = document.getElementById('payment');
  const creditCardInput = document.getElementById('credit-card');
  const paypalInfo = document.getElementById('paypal-info');
  const bitcoinInfo = document.getElementById('bitcoin-info');
  const submitButton = document.getElementsByTagName('button')[0];
  //frequently used
  const show = (color) => {
    color.style.display = "";
  }
  const hide = (color) => {
    color.style.display = "none";
  }

  //initial actions
  nameInput.focus();
  activityField.appendChild(cost);
  hide(otherJobRole);
  hide(creditCardInput);
  hide(paypalInfo);
  hide(bitcoinInfo);
  hide(cost);
  submitButton.disabled = true;

  //basic interactions
  form.addEventListener('change', (e) => {
    console.log(e.target);
    //Job Titles===========================================
    if(jobTitle.value === "other"){
      show(otherJobRole);
    }else{
      hide(otherJobRole);
    }

    //Theme and colors=====================================
    let colorOptions = colors.children;
    //reset color option
    if(e.target.id == 'design'){
      colors.value = "none";
    }
    //checks all color options
    for(let i = 0; i < colorOptions.length; i++){
      //checks what theme to make visible
      if(colorOptions[i].className == theme.value){
        show(colorOptions[i]);
      }else{
        hide(colorOptions[i]);
      }
      //shows all options if no theme chosen
      if(theme.value == "none"){
        show(colorOptions[i]);
      }
    }

    //activities and availability==========================
    let totalCost = 0;
    let disable9Am = "";
    let disable1Pm = "";

    for(let i = 0; i < activities.length - 2; i++){
      //reset disabled checkboxes
      activities[i].disabled = false;
      //what activity wont be disabled
      if(activities[i].checked){
        if(activities[i].parentNode.textContent.includes("9am")){
          disable9Am = i;
        }else if (activities[i].parentNode.textContent.includes('1pm')){
          disable1Pm = i;
        }
      }
    }
    //disables whatever activity wasnt checked
    //for tuesday
    for(let i = 0; i < activities.length - 2; i++){
      if(activities[i].parentNode.textContent.includes("9am") && disable9Am != ""){
        if(i != disable9Am){
          activities[i].disabled = true;
        }
      }else if(activities[i].parentNode.textContent.includes("1pm") && disable1Pm != ""){
        if(i != disable1Pm){
          activities[i].disabled = true;
        }
      }
    }
    for(var i = 0; i < activities.length; i++) {
      if (activities[i].checked) {
        totalCost += 100;
        if(i == 0){
          totalCost += 100;
        }
      }
    }
    //updates cost displayed
    cost.textContent = "Total Cost: $" + totalCost;
    cost.style.color = "black";
    if(totalCost == 0){
      //requires at least one activity
      activityField.style.border = "2px solid red";
      submitButton.disabled = true;
      hide(cost);
    }else{
      activityField.style.border = "";
      show(cost);
    }
    //Payment method=======================================
    if(payment.value == 'credit card'){
      show(creditCardInput);
      hide(paypalInfo);
      hide(bitcoinInfo);
      submitButton.disabled = false;
    }else if(payment.value == 'paypal'){
      show(paypalInfo);
      hide(creditCardInput);
      hide(bitcoinInfo);
      submitButton.disabled = false;
    }else if (payment.value == 'bitcoin') {
      show(bitcoinInfo);
      hide(paypalInfo);
      hide(creditCardInput);
      submitButton.disabled = false;
    }else{
      submitButton.disabled = true;
      hide(paypalInfo);
      hide(bitcoinInfo);
      hide(creditCardInput);
    }
  });
  //Form validation
  form.addEventListener('blur', (e) => {
    console.log(e.target.id);
    //name field cant be empty
    if(e.target.id == 'name'){
      if(nameInput.value == ""){
        nameInput.style.border = '2px red solid';
        submitButton.disabled = true;
      }else{
        nameInput.style.border = '2px solid #5e97b0';
      }
    }
    //email format check
    let re = /\S+@\S+\.\S+/;
    if(e.target.id == "mail"){
      if(re.test(emailInput.value)){
        emailInput.style.border = '2px solid #5e97b0';
      }else{
        emailInput.style.border = '2px solid red';
        submitButton.disabled = true;
      }
    }

  }, true);
});
