console.clear();
//****CANVAS VIEW SETUP****//
//to setup a full screen Canvas demo in JavaScript, we need to select the canvas from the DOM and get its dimensions


const canvas = document.getElementById("scene");
//canvas dimensions
//width of scene
//-let width = canvas.offsetWidth;
canvas.width = canvas.clientWidth;
//height of scene
//-let height = canvas.offsetHeight;
canvas.height = canvas.clientHeight;
//2D context
const ctx = canvas.getContext("2d");
//rest of the setup is mostly about handling the user resizing their screen
//create function 
//function called right after user resized its screen
//-function onResize () { (repeated so set variable)
//define the dimensions of our canvas element
//javascript doesn't know the computed dimensions from CSS so we need to do it manually //
//-width = canvas.offsetWidth; (repeated so set variable)
//-height = canvas.offsetHeight; (repeated so set variable)
//canvas size set for width and height
//if the screen device has a pixel ratio over 1 we render the canvas 2x bigger to make it sharper (e.g. Retina iPhone)
if (window.devicePixelRatio > 1) {
    //2x the width and height user screen ratio
    canvas.width = canvas.clientWidth * 2;
    canvas.height = canvas.clientHeight * 2;
    ctx.scale(2, 2);
    //default screen ratio of 1x
    //-} else {F
    //-canvas.width = width;
    //-canvas.height = height;
    //-}
}
//define the dimensions of our canvas element
let width = canvas.offsetWidth;
let height = canvas.offsetHeight;
//store every particle in this array 
const dots = [];

//****PARTICLE SETUP****//
//class information = https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
//this information = https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
//ctx information = a shorthand for the word "context". That's it.
//abs information = The abs() method returns the absolute value of a number.

//define random properties for every particle while still sharing common methods between all of them
//the first part of a class is the constructor method
//use it to store the custom properties of each particle
//also create two methods for our dots: project() and draw()

//variables
//amount of squares on screen
const SquareAmount = 750;
//radius of square
const SquareRadius = 5;
//field of view of our 3D scene
let PERSPECTIVE = width * 0.8;
//x center of canvas
let PROJECTION_CENTER_X = width / 2;
//y center of canvas
let PROJECTION_CENTER_Y = height / 2;
//store every particle in this array 
//-const dots = [];

class Square {
    //create particles on canvas
    constructor() {
        //random x position
        this.x = (Math.random() - 0.5) * width;
        //random y position
        this.y = (Math.random() - 0.5) * height;
        //random z position
        this.z = Math.random() * width;
        //size in 3D world
        this.radius = 10;

        //2D x coordinate
        this.xProjected = 0;
        //2D y coordinate
        this.yProjected = 0;
        //scale element in 2D(further=smaller)
        this.scaleProjected = 0;
        //3rd Party Plugin for Animation
        gsap.to(this, (Math.random() * 10 + 15), {
            z: width,
            //number of repeats (-1 for infinite)
            repeat: -1,
            //if true > A-B-B-A, if false > A-B-A-B
            yoyo: true,
            ease: "power2",
            //or ease like "power2"
            yoyoEase: true,
            //random delay time
            delay: Math.random() * -25
        });
    }
    //move particles from 2D to 3D
    project() {
        //info for element scaled to distance from screen
        this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);
        //x position in 2D
        this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X;
        //y position in 2D
        this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y;
    }
    //draw particles on string
    draw() {
        //value of the elements
        this.project();
        //particle opacity based on distance from screen
        ctx.globalAlpha = Math.abs(1 - this.z / width);
        //draw rectangle based on prjected coordinates and scale
        ctx.fillRect(this.xProjected - this.radius, this.yProjected - this.radius, this.radius * 2 * this.scaleProjected, this.radius * 2 * this.scaleProjected);
    }
}

function createSquares() {
    //dots array will be empty
    dots.length = 0;
    //create squares
    for (let i = 0; i < SquareAmount; i++) {
        //create dots in array until 750
        dots.push(new Square());
    }

}

//**** RENDERING ANIMATION ****/

function render() {
    //clear canvas from left to bottom right
    ctx.clearRect(0, 0, width, height);
    //loop through dots array
    for (var i = 0; i < dots.length; i++) {
        //draw element
        dots[i].draw();
    }
    window.requestAnimationFrame(render);
}

// Function called after the user resized its screen
function afterResize() {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    if (window.devicePixelRatio > 1) {
        canvas.width = canvas.clientWidth * 2;
        canvas.height = canvas.clientHeight * 2;
        ctx.scale(2, 2);
    } else {
        canvas.width = width;
        canvas.height = height;
    }
    PROJECTION_CENTER_X = width / 2;
    PROJECTION_CENTER_Y = height / 2;
    PERSPECTIVE = width * 0.8;

    createSquares(); // Reset all dots
}
// Variable used to store a timeout when user resized its screen
let resizeTimeout;
// Function called right after user resizes screen
function onResize() {
    // Clear the timeout variable
    resizeTimeout = window.clearTimeout(resizeTimeout);
    // Store a new timeout to avoid calling afterResize for every resize event
    resizeTimeout = window.setTimeout(afterResize, 500);
}
//listen for screen resize
window.addEventListener('resize', onResize);
//correct canvas size on screen
createSquares();
//render once ready
window.requestAnimationFrame(render);