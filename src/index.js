import "./hello1"
import "./style.css"

let aa = "hello"
console.log(aa)

let avatar = require("./images/1.jpg")
let img = new Image();
img.src = avatar;
document.getElementById("wrapper").appendChild(img)
