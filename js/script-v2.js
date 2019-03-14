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
    activityField.style.border = "";
  }
}
const checkCost = (cost) => {
  if(cost == 0){
    cantSubmit(activityField);
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
    }else{
      show(paymentMethod[method]);
    }
  }
}
const checkFilled = (evt, id, test) => {
  console.log(evt.tar
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
const validateCard = () => {
  if(payment.value == 'credit card'){
    if(checkDigitData('cc-num', ccNum, 13) ||
    checkDigitData('cc-num', ccNum, 14) ||
    checkDigitData('cc-num', ccNum, 15) ||
    checkDigitData('cc-num', ccNum, 16) ||
    checkDigitData('zip', ccZip, 5) ||
    checkDigitData('cvv', ccCVV, 3)){
      return true;
    }
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
form.addEventListener('blur', (e) => {
  //name
  checkFilled(e, 'name', nameInput.value == "");
  checkFilled(e, 'name', nameInput.placeholder == "Required");
  //email
  let re = /\S+@\S+\.\S+/;
  checkFilled(e, 'mail', re.test(emailInput.value) == false);
},true);
