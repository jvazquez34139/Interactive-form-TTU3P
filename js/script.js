document.addEventListener('DOMContentLoaded', () => {

  //html elements to manipulate
  const form = document.getElementsByTagName('form')[0];
  const nameInput = document.getElementById('name');
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
  hide(otherJobRole);
  hide(creditCardInput);
  hide(paypalInfo);
  hide(bitcoinInfo);
  submitButton.disabled = true;


  jobTitle.addEventListener('change', () => {
    if(jobTitle.value === "other"){
      show(otherJobRole);
    }else{
      hide(otherJobRole);
    }
  });

  //checks for change in theme
  theme.addEventListener('change', () => {

    let colorOptions = colors.children;

    //reset color option
    color.value = "none";

    //checks all color options
    for(let i = 0; i < colorOptions.length; i++){

      //checks what theme to make visible
      if(colorOptions[i].className == theme.value){
        show(colorOptions[i]);
      }else{
        hide(colorOptions[i]);
      }

      if(theme.value == "none"){
        show(colorOptions[i]);
      }
    }
  });

  activityField.appendChild(cost);
  hide(cost);

  //activity availability
  activityField.addEventListener('change', () => {
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
      hide(cost);
    }else{
      show(cost);
    }
  })

  //form of payment section
  payment.addEventListener('change', function(){
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
  })

  if (nameInput.value == "") {

  }
});
