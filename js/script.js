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
  const ccNum = document.getElementById('cc-num');
  const ccZip = document.getElementById('zip');
  const ccCVV = document.getElementById('cvv');
  const ccExD = document.getElementById('exp-year');
  const paypalInfo = document.getElementById('paypal-info');
  const bitcoinInfo = document.getElementById('bitcoin-info');
  const submitButton = document.getElementsByTagName('button')[0];
  //requirements
  let submitableName = false;
  let submitableEmail = false;
  let submitableCardNum = false;
  let submitableZip = false;
  let submitableCVV = false;
  let chosePayMethod = false;
  //frequently used
  const show = (element) => {
    element.style.display = "";
  }
  const hide = (element) => {
    element.style.display = "none";
  }
  const cantSubmit = (element) => {
    element.style.border = '2px solid red';
  }
  //initial actions
  nameInput.focus();
  activityField.appendChild(cost);
  hide(otherJobRole);
  hide(creditCardInput);
  hide(paypalInfo);
  hide(bitcoinInfo);
  hide(cost);
  //basic interactions
  form.addEventListener('change', (e) => {
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //Job Titles
    if(jobTitle.value === "other"){
      show(otherJobRole);
    }else{
      hide(otherJobRole);
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //Theme and colors
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
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //activities and availability
    let timeString = (index, time) => {
      return activities[index].parentNode.textContent.includes(time);
    }
    let totalCost = 0;
    let disable9Am = "";
    let disable1Pm = "";

    for(let i = 0; i < activities.length - 2; i++){
      //reset disabled checkboxes
      activities[i].disabled = false;
      //what activity wont be disabled
      if(activities[i].checked){
        if(timeString(i, '9am')){
          disable9Am = i;
        }else if (timeString(i, '1pm')){
          disable1Pm = i;
        }
      }
    }
    //disables whatever activity wasnt checked for tuesday
    for(let i = 0; i < activities.length - 2; i++){
      if(timeString(i, '9am') && disable9Am != ""){
        if(i != disable9Am){
          activities[i].disabled = true;
        }
      }else if(timeString(i, '1pm') && disable1Pm != ""){
        if(i != disable1Pm){
          activities[i].disabled = true;
        }
      }
    }
    //calculates total cost of activities
    for(let i = 0; i < activities.length; i++) {
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
      activityField.style.border = "";
      show(cost);
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //Payment method
    //if no activities checked, then payment is unavailable
    let checkCost = () => {
      if(totalCost == 0){
        cantSubmit(activityField);
        payment.value = "select_method";
        return false;
      }else{
        chosePayMethod = true;
        return true;
      }
    }
    //when changed from default selection, if not $0 Cost
    //then a pay method was chosen
    if(checkCost()){
      if(payment.value == 'credit card'){
        show(creditCardInput);
        hide(paypalInfo);
        hide(bitcoinInfo);
      }else if(payment.value == 'paypal'){
        show(paypalInfo);
        hide(creditCardInput);
        hide(bitcoinInfo);
      }else if (payment.value == 'bitcoin') {
        show(bitcoinInfo);
        hide(paypalInfo);
        hide(creditCardInput);
      }
    }else{
      hide(paypalInfo);
      hide(bitcoinInfo);
      hide(creditCardInput);
    }
  });
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //Form validation
  form.addEventListener('blur', (e) => {
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //name field cant be empty
    if(e.target.id == 'name'){
      if(nameInput.value == ""){
        cantSubmit(nameInput);
      }else{
        nameInput.style.border = '2px solid #85b5ca';
        submitableName = true;
      }
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //email format check
    let re = /\S+@\S+\.\S+/;
    if(e.target.id == 'mail'){
      if(re.test(emailInput.value)){
        emailInput.style.border = '2px solid #85b5ca';
        submitableEmail = true;
      }else{
        cantSubmit(emailInput);
      }
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //card numbers validation
    const checkDigitData = (id, element, length) =>{
      if(e.target.id == id){
        if(isNaN(element.value) === false){
          if(element.value.length == length){
            element.style.border = '2px solid #85b5ca';
            return true;
          }else{
            cantSubmit(element);
            return false;
          }
        }else{
          cantSubmit(element);
          return false;
        }
      }
    }
    if(payment.value == 'credit card'){
      if(checkDigitData('cc-num', ccNum, 13) ||
      checkDigitData('cc-num', ccNum, 14) ||
      checkDigitData('cc-num', ccNum, 15) ||
      checkDigitData('cc-num', ccNum, 16)){
        submitableCardNum = true;
      }
      submitableZip = checkDigitData('zip', ccZip, 5);
      submitableCVV = checkDigitData('cvv', ccCVV, 3);
    }
    //refactor more later before finishing
  }, true);
  submitButton.addEventListener('click', (e) => {
    //disable submit if all tests were not passed
    if(submitableName &&
    submitableEmail &&
    chosePayMethod){
      if(payment.value == 'credit card'){
        if(submitableCardNum &&
        submitableZip &&
        submitableCVV){
          console.log('submitted');
        }else{
          e.preventDefault();
        }
      }
      console.log('submitted');
    }else{
      e.preventDefault();
    }
  });
});
