const calculator=document.querySelector(".calculator")
const keys=calculator.querySelector(".calculator__keys")
/*
(function (a) {
    return a + 100;
});

a => a + 100;
both the above codes are equivalent functions. arrow function is a compact alternative, no need to use return statement also
*/

//routine to display what button clicked
keys.addEventListener('click',e=>{
    if (e.target.matches('button')){ //did the event occur on a button?
        const key=e.target //where did the event occur
        const action=key.dataset.action //dataset to access custom 'data-' attribute, 'action' to target 'data-action'
        if (!action){
            console.log("number key!")
        }
        if(
            action === 'add' ||
            action === 'subtract' ||
            action === 'multiply' ||
            action === 'divide'
          ){
            console.log('operator key!')
        }
        if(action === 'decimal') {
            console.log('decimal key!')
        }
        if(action === 'clear') {
            console.log('clear key!')
        }
        if (action === 'calculate') {
            console.log('equal key!')
        }
    }
})

//basic routine, num 0-9, single operation, single equal 

const calculate =(n1,operator,n2)=>{
  let result ='' //let- to declare block scoped variable, instead of var -use with if-else block and single return statement after all else blocks
  //js does implicit type coercion for - / *, converts string to numeric type
  //does concatenation for +, so we do explicit type conversion
  if (operator ==='add'){
    return parseFloat(n1)+parseFloat(n2) //early return, no need to use else
  }
  if (operator === 'subtract'){
    return n1-n2
  }
  if (operator === 'multiply'){
    return n1*n2
  }
  if (operator ==='divide'){
    return n1/n2
  }
}

const display=document.querySelector(".calculator__display") //access display
keys.addEventListener('click',e=>{
  if (e.target.matches('button')){
    const key=e.target
    const action=key.dataset.action
    const keyContent=key.textContent //which key was pressed
    const displayedNum=display.textContent //displayed number
    const previousKeyType=calculator.dataset.previousKeyType //set after identifying action
    
    //release operator- remove is-depressed class when new key pressed
    Array.from(key.parentNode.children) 
      .forEach(k => k.classList.remove('is-depressed'))
    
    if (!action){ //if no action, i.e. number pressed
      if (displayedNum === '0' || previousKeyType === 'operator' || previousKeyType ==='calculate'){ //strict equality (type and value)
        display.textContent =keyContent //set textContent of the display element to keyContent when display has 0 or when a number is pressed after an operator or =
        }
      else{
        display.textContent=displayedNum+keyContent //append to previously pressed num
      }
      calculator.dataset.previousKeyType='number'
    }
    
    if (action==='decimal'){
      if (!displayedNum.includes('.')){ //do not allow multiple decimal points
        display.textContent=displayedNum+ '.' //add point if decimal key is pressed
      }
      else if (previousKeyType==='operator' ||previousKeyType==='calculate' ){
        display.textContent='0.'
      }
      calculator.dataset.previousKeyType='decimal'
    }
    
    if (action ==='add' || action==='subtract'||action==='multiply'||action=='divide'){
      
      //number op1 number op2 pressed- update displayed value for op1
      const firstValue=calculator.dataset.firstValue
      const operator=calculator.dataset.operator
      const secondValue=displayedNum
      
      if (firstValue && operator && previousKeyType !=='operator' && previousKeyType !=='calculate'){ //we will always have second number on display. so check if there is a firstvalue and an operator entered before, dont perform computation for continuous presses on operator or = pressed after operator
        const calcValue=calculate(firstValue,operator,secondValue) 
        display.textContent=calcValue
        calculator.dataset.firstValue = calcValue //updation for the next computation
      }else{
        calculator.dataset.firstValue=displayedNum //no prev op
      }
      
      key.classList.add('is-depressed') //add class is-depressed to the operation button when it is pressed to add the styles
      //show which operator is active
      calculator.dataset.previousKeyType='operator' //set custom attribute to operator-->used to check if prev key is operator
      calculator.dataset.operator=action
    }
    
    //computing value
    if (action==='calculate'){
      let secondValue=displayedNum //easily retrieved
      //we need the first number and the operator to perform computation
      //retrieve from calculator.dataset
      let firstValue=calculator.dataset.firstValue //use let as we are modifying it inside if block
      const operator=calculator.dataset.operator
      if (firstValue){
        if (previousKeyType==='calculate'){//for continous calculations eg 5-1=4 =3=2 (continously subract 1 from prev result)
          firstValue=displayedNum 
          secondValue=calculator.dataset.modValue
        }
        display.textContent=calculate(firstValue,operator,secondValue) //function for computation, perform when there is a value entered, no operation on continuous clicks
      }
      calculator.dataset.modValue=secondValue //to use in the continous calculation
      calculator.dataset.previousKeyType='calculate'
    }
    
    if (action!=='clear'){ //any button pressed, change AC to CE
      const clearButton=calculator.querySelector('[data-action=clear]')
      clearButton.textContent='CE'
    }
    if (action ==='clear'){ //AC- reset everything, CE- clear current entry
      if (key.textContent==='AC'){//reset
        calculator.dataset.firstValue=''
        calculator.dataset.secondValue=''
        calculator.dataset.operator=''
        calculator.dataset.previousKeyType=''
      }else{//CE pressed, clear current display alone
        key.textContent='AC'
      }
      display.textContent=0
      calculator.dataset.previousKeyType='clear'
    }
    
  }
})