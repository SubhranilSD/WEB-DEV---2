function handlechange(event){
    document.getElementById("output").
    textContent = "Change Detected";
    
}
document.getElementById("input").
addEventListener("change", (event)=>{
    //here event is the synthetic event which
    // comes underaddeventlisteners callback
    // function. 
    // It will print the event object 
    // which stores all information about
    // the form tag

    console.log(event.target.value);

    document.getElementById("output").
    textContent = event.target.value;
    
});