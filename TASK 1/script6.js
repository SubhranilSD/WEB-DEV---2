const headingElement = document.getElementById("myheading");
console.log(headingElement);

headingElement.textContent = "New Content";
headingElement.style.color = "blue";

const paragraph = document.querySelector("#content h1");

paragraph.textContent = "This program has been updated using queryselector.";

paragraph.style.color = "green";
//task3

const task3 = document.getElementsByTagName("p");
console.log(task3);
for (let i = 0; i < task3.length; i++) {
    if (i % 2 == 0) {
        task3[i].style.color = "blue";
    }
    else {
        task3[i].style.color = "red";
    }
}
task3[task3.length - 1].style.fontWeight = "bold";

