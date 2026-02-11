const para = document.createElement("p");
para.textContent = "This is a dynamically created Paragraph";
console.log(para)
//append
document.getElementById("content").appendChild(para)
//remove element
document.querySelector("#content p").remove()


const image = document.createElement("img");
image.setAttribute("src", "link daalo yaha")
image.setAttribute("alt", "JavaScript")
const gallery = document.getElementById("gallery");
gallery.appendChild(image);
