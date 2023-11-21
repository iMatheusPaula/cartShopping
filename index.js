let buttonBuy = document.querySelectorAll('.buy');

function btnFunc(event){
    var item = document.getElementsByClassName('box').value;
    console.log(item);
}

for(var i=0; i<buttonBuy.length; i++){
    var button = buttonBuy[i];
    button.addEventListener('click', btnFunc);
}