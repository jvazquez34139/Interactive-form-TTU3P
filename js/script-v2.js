//DOMs
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

//frequently used functions
const show = (element) => {
  element.style.display = "";
}
const hide = (element) => {
  element.style.display = "none";
}
const cantSubmit = (element) => {
  element.style.border = '2px solid red';
}
const dispAll = (dispType, items) => {
  if(dispType == "hide"){
    items.forEach(item => {
      hide(item);
    });
  }else if(dispType == 'show'){
    items.forEach(item => {
      show(item);
    });
  }else{
    console.log('dispType: "hide" or "show", items: [DOMs]');
  }
}

//initial actions
nameInput.focus();
activityField.appendChild(cost);
activities[0].checked = true;
cost.textContent = "Total cost: $200";
errDiv.appendChild(errorMessage);
const thingsToHide = [otherJobRole, creditCardInput, paypalInfo, bitcoinInfo, colorsDisp];
dispAll('hide', thingsToHide);

//form info functions
const displayOtherJobs = () => {
  if(jobTitle.value === "other"){
    show(otherJobRole);
  }else{
    hide(otherJobRole);
  }
}
const themeAndColors = (e) => {
  let colorOptions = colors.children;
  if(e.target.id === 'design'){
    colors.value = 'none';
  }
  for(let i = 0; i < colorOptions.length; i++){
    if(colorOptions[i].className === theme.value){
      show(colorOptions[i]);
    }else{
      hide(colorOptions[i]);
    }

    if(theme.value === "none"){
      hide(colorsDisp);
    }else{
      show(colorsDisp);
    }
  }
}
const timeString = (index, time) => {
  return activities[index].parentNode.textContent.includes(time);
}
const activityAvailability = () => {
  checkedData = ["", ""];
  for(let i = 0; i < activities.length - 2; i++){
    //reset disabled checkboxes
    activities[i].disabled = false;
    //what activity wont be disabled
    if(activities[i].checked){
      if(timeString(i, '9am')){
        checkedData[0] = i;
      }else if (timeString(i, '1pm')){
        checkedData[1] = i;
      }
    }
  }
  //disables whatever activity wasnt checked for tuesday
  for(let i = 0; i < activities.length - 2; i++){
    if(timeString(i, '9am') && checkedData[0] != ""){
      if(i != checkedData[0]){
        activities[i].disabled = true;
      }
    }else if(timeString(i, '1pm') && checkedData[1] != ""){
      if(i != checkedData[1]){
        activities[i].disabled = true;
      }
    }
  }
}
const addCost = () => {
  let costTotal = 0
  for(let i = 0; i < activities.length; i++){
    if(activities[i].checked){
      costTotal += 100;
      if(i == 0){
        costTotal += 100;
      }
    }
  }
  return costTotal;
}
const displayCost = (cost,element) => {
  if(cost == 0){
    element.textContent = "Requires one activity checked"
  }else{
    element.textContent = "Total Cost: $" + cost;
  }
}
const checkCost = (cost) => {
  if(cost == 0){
    payment.value = "select_method";
    return false;
  }else{
    return true;
  }
}
const paymentInfo = (checkCost) => {
  const paymentMethod = {
    "credit card": creditCardInput,
    "paypal": paypalInfo,
    "bitcoin": bitcoinInfo
  }
  for(method in paymentMethod){
    if(method != payment.value){
      hide(paymentMethod[method]);
      chosePayMethod = false;
    }else{
      show(paymentMethod[method]);
      chosePayMethod = true;
    }
  }
}
const checkFilled = (evt, id, test) => {
  if(evt.target.id == id){
    if(test){
      cantSubmit(evt.target);
      evt.target.placeholder = "Required";
    }else{
      evt.target.style.border = '2px solid #b585ca';
      evt.target.placeholder = "";
      return true;
    }
  }
}
const checkDigitData = (e, id, element, length) =>{
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
const validateCard = e => {
  if(payment.value == 'credit card'){
    if(checkDigitData(e, 'cc-num', ccNum, 13) ||
    checkDigitData(e, 'cc-num', ccNum, 14) ||
    checkDigitData(e, 'cc-num', ccNum, 15) ||
    checkDigitData(e, 'cc-num', ccNum, 16)){
      submitableCardNum = true;
    }
    submitableZip = checkDigitData(e, 'zip', ccZip, 5);
    submitableCVV = checkDigitData(e, 'cvv', ccCVV, 3);
  }
}

//listeners
form.addEventListener('change', e => {
  displayOtherJobs();
  themeAndColors(e);
  activityAvailability();
  displayCost(addCost(),cost)
  if(addCost == 0){
    payment.value == "none";
  }
  paymentInfo(checkCost(addCost()));
});
form.addEventListener('blur', e => {
  //name
  if(checkFilled(e, 'name', nameInput.value == "") ||
  checkFilled(e, 'name', nameInput.placeholder == "Required")){
    submitableName == true
  }
  //email
  let re = /\S+@\S+\.\S+/;
  submitableEmail = checkFilled(e, 'mail', re.test(emailInput.value) == false);
  validateCard(e);
},true);
submitButton.addEventListener('click', e => {
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
