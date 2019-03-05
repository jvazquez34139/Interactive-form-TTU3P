document.addEventListener('DOMContentLoaded', () => {
  //html elements to manipulate
  const form = document.getElementsByTagName('form')[0];
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('mail');
  const jobTitle = document.getElementById('title');
  const otherJobRole = document.getElementById('other-title');
  const theme = document.getElementById('design');
  const colors = document.getElementById('color');
  const colorsDisp = document.getElementById('colors-js-puns');
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
  const errDiv = document.getElementById('error');
  const errorMessage = document.createElement('p');
  //requirements for submission
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
  const dispAll = (dispType, items){
    if(dispType == "hide"){
      items.forEach(item => {
        show(item);
      });
    }else if(dispType == "show"){
      items.forEach(item => {
        hide(item);
      });
    }else{
      console.log('dispType: "hide" or "show", items: [DOMs]');
    }
  }
  const cantSubmit = (element) => {
    element.style.border = '2px solid red';
  }
  //initial actions
  nameInput.focus();
  activityField.appendChild(cost);
  activities[0].checked = true;
  cost.textContent = "Total cost: $200";
  errDiv.appendChild(errorMessage);
  const thingsToHide = [otherJobRole, creditCardInput, paypalInfo, bitcoinInfo, colorsDisp];
  dispAll('hide', thingsToHide);
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
        hide(colorsDisp);
      }else{
        show(colorsDisp);
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
    if(totalCost == 0){
      cost.textContent = "Requires one activity checked"
    }else{
      cost.textContent = "Total Cost: $" + totalCost;
      activityField.style.border = "";
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
        chosePayMethod = true;
      }else if(payment.value == 'paypal'){
        show(paypalInfo);
        hide(creditCardInput);
        hide(bitcoinInfo);
        chosePayMethod = true;
      }else if (payment.value == 'bitcoin') {
        show(bitcoinInfo);
        hide(paypalInfo);
        hide(creditCardInput);
        chosePayMethod = true;
      }
    }else{
      hide(paypalInfo);
      hide(bitcoinInfo);
      hide(creditCardInput);
      chosePayMethod = false;
    }
  });
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //Form validation
  form.addEventListener('blur', (e) => {
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //name field cant be empty
    if(e.target.id == 'name'){
      if(nameInput.value == "" || nameInput.value == "Required"){
        cantSubmit(nameInput);
        nameInput.value = "Required";
      }else{
        nameInput.style.border = '2px solid #b585ca';
        submitableName = true;
      }
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //email format check
    let re = /\S+@\S+\.\S+/;
    if(e.target.id == 'mail'){
      if(re.test(emailInput.value)){
        emailInput.style.border = '2px solid #b585ca';
        submitableEmail = true;
      }else{
        cantSubmit(emailInput);
        emailInput.value = "Required";
      }
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //card numbers validation
    const checkDigitData = (id, element, length) =>{
      if(e.target.id == id){
        if(isNaN(element.value) === false){
          if(element.value.length == length){
            element.style.border = '2px solid #b585ca';
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
  }, true);
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //submission and error notifications
  submitButton.addEventListener('click', (e) => {
    let errText = "";
    errorMessage.style.color = 'red';
    //disable submit if any tests were not passed
    //edit to show first and other invalid info
    //checks in reverse order so the earliest error is the latest update

    //credit card requirements
    if(payment.value == 'credit card'){
      if(submitableCVV != true){
        if(ccCVV.value == ""){
          errText = "A card CVV is required.";
        }else if(isNaN(ccCVV.value)){
          errText = "CVV must contain ONLY numbers.";
        }else if(ccCVV.value.length != 3){
          errText = "Card CVV provided is an invalid length."
        }
      }
      if(submitableZip != true){
        if(ccZip.value == ""){
          errText = "A ZIP is required.";
        }else if(isNaN(ccZip.value)){
          errText = "ZIP must contain ONLY numbers.";
        }else if(ccZip.value.length != 5){
          errText = "ZIP number provided is an invalid length."
        }
      }
      if(submitableCardNum != true){
        if(ccNum.value == ""){
          errText = "A card number is required.";
        }else if(isNaN(ccNum.value)){
          errText = "Card number must contain ONLY numbers.";
        }else if(ccNum.value.length < 13 || ccNum.value.length > 16){
          errText = "Card number provided is an invalid length."
        }
      }
    }
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //basic requirements
    if(chosePayMethod != true){
      errText = "A payment method is required."
    }
    if(submitableEmail != true){
      if(emailInput.value == ""){
        errText = "An Email is required."
      }
      else{
        errText = "Email requires a valid format."
      }
    }
    if(submitableName != true){
      errText = "A name is required."
    }
    if(errText != ""){
      e.preventDefault();
      errorMessage.textContent = errText;
    }
  });
});
