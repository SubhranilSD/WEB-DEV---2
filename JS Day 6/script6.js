const headingElement= document.getElementById("myheading");
console.log(headingElement);

headingElement.textContent= "New Content";
headingElement.style.color= "blue";

const paragraph= document.querySelector("#content h1");

paragraph.textContent= "This program has been updated using queryselector.";

paragraph.style.color= "green";