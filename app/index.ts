import document from "document"
import {me} from "appbit"
import { user } from "user-profile"
import { me as device } from "device"
import widgetFactory from './widgets/widget-factory'
import curvedText from './widgets/curved-text'
import clock from "clock"

/*---------------------------------------------------------------------------------------------------------------------------------*/
//Initialise widget system
const widgets = widgetFactory([curvedText])
widgets.registerContainer(document)
const curvedTextWidget1 = (document as any).getWidgetById('curvedText1')  // 'as any' is a horrible kludge; we should define an interface 'WidgetSearch'
curvedTextWidget1.startAngle = 180
const curvedTextWidget2 = (document as any).getWidgetById('curvedText2')  // 'as any' is a horrible kludge; we should define an interface 'WidgetSearch'
curvedTextWidget2.text = '123456'
curvedTextWidget2.charAngle = 45  // specify exactly how many degrees per character, instead of modus==="auto"
/*let angle = 0
setInterval(() => {
  angle = (angle + 5) % 360
  curvedTextWidget1.startAngle = angle  // this is unforgiveably inefficient
}, 100)*/


let myText = document.getElementById("myText") as TextElement;
let myText2 = document.getElementById("myText2") as TextElement;
let position = document.getElementById("position") as ContainerElement;

//perhaps we could have something similar to this per Label ?

//const timeLabel = new curvedText({ id:'timeLabel', modus:"auto",radius:100,centerX: 168,centery:168,rotateText:0,letterSpacing:10,textAnchor:"middle"}];

//YOUR SETTINGS---------------------------------------------------------------------------------------------------------------
//control panel in index.ts
let textID = document.getElementsByClassName("textID");
//let ID = myText
//Circle
let radius: number = 120;//if negative, text is bottom curve
let centerX: number = 168; //moves the centerpoint of the circle
let centerY: number = 168;
//text
let rotateText: number = 0;//angle to rotate whole text from it´s beginning
let letterSpacing: number = 5;
let textAnchor: string = "middle"; //start, middle,  end at 0°
let modus: string = "auto"; // auto: automatic, fix: rotate fix angle each


//Rotate fix angle
let charAngle: number = 10;//angle each char
//-----------------------------------------------------------------------------------------------------------------------------

myText.text = "MiMiMiMiMiMi"  ; //"0.0.0.0.0.0.0.0.0"
myText2.text = "CHANGING"// enter text ar data here "MiMiMiMiMiMi"

//-----------------------------------------------------------------------------------------------------------------------------
/* after I read your widgets-factory a few times, I finally understood   // Please delete this, if useless BW
  this is exactly what you are going to do.
  I´ve got to understand your construction/syntax better....
//FIRST STEP DONE

let t: number;
//textID[t].id;
for (t = 0; t < textID.length; t++) {
console.log("all texts ID "+textID[t].id);
let content = textID ;
console.log("all texts by ID " + content[t].text)

//content[1].text = "LET ME SEE"// enter text ar data here MiW!MiW!MiW!M
}
*/

//outcommented to concentrate on widgetFactory, as it might become inconsistent if both run parallel
//---------------------------------------------------------------------------------------------------------------------------------
//VARIABLES

//CENTER OF ROTATION

position.x = centerX - device.screen.width / 2; // -half width. why is me.screen.width / 2 not working??? Permission?

/*CENTER OF ROTATION*/
position.x = centerX - device.screen.width / 2; // -half width
position.y = centerY - device.screen.height / 2;

//PREVENT MIRRORING
charAngle = charAngle * (radius < 0 ? -1 : 1);

//ASSIGN CHARS
let chars = (myText.text.split("")); // array of char set of text to curve
let char  = document.getElementsByClassName("char") as TextElement[];// single char textElements


//CALCULATE PROPERTIES OF CHARS
let i;
let numChars = chars.length
for (i = 0; i < numChars ; i++) {

    char[i].text = chars[i];// assign chars to the single textElements
    char[i].y = radius < 0 ? - radius : - radius + char[0].getBBox().height / 2;//move text it´s height downwards

    //FOR AUTO MODUS
    if (modus == "auto") {

      const circ = 2 * radius * Math.PI;
      let degreePx = 360 / circ;
      let charWidth = char[i].getBBox().width;
      let widths = i < numChars ? char.map(c => c.getBBox().width) : "", sum: number;

      //@ts-ignore
      let cumWidths =  widths.map((elem: number) => i >= numChars ? sum = 0 : sum = (sum || 0) + elem); // sums up widths
      let textWidth = (myText as TextElement).getBBox().width; // width original text

      let w: number;
        for (w = 1; w < numChars + 1; w++) {
          // width of the previous char
          let nextWidth = char[w].getBBox().width;
          let halfNext = nextWidth / 2;


          //calculates rotation angle for each char
          //to define distance : half width previous char + half width current char + half letterspacing
          (char[i].parent as GroupElement).groupTransform.rotate.angle =
          (cumWidths[i]  - charWidth / 2 + halfNext  + (i-1/2) * letterSpacing)  * degreePx;

          //prevWidth = nextWidth; // not used
        }

         //TEXT-ANCHOR and ROTATION
            let last = numChars -1;
            let lastChar = last - 1;
            let firstChar = cumWidths[0];


            (char[i].parent.parent as GroupElement).groupTransform.rotate.angle =

            rotateText
                -  (textAnchor == "middle" ? (textWidth +  (i - 1) * letterSpacing )  * degreePx / 2
              :    textAnchor == "start" ?  (letterSpacing - firstChar) / 2  * degreePx
              : +  (textWidth + (i - 3/2 ) * letterSpacing + lastChar  / 2 ) * degreePx);

    }else{

      //ROTATION PER CHAR
      (char[i].parent as GroupElement).groupTransform.rotate.angle = i > 0 ? i * charAngle : 0;

      //TEXT-ANCHOR
      (char[i].parent.parent as GroupElement).groupTransform.rotate.angle = rotateText

           - (textAnchor == "middle" ? (numChars - 1)* charAngle / 2
         :   textAnchor == "start" ?  - (charAngle / 2)
         : + (numChars - (numChars % 2 == 0 ? 0.5 : 1)) * charAngle);

    };

 };
//ANIMATION----------------------------------------------------------------------------------------------
let textChars = document.getElementById("textChars") as GroupElement;

// Rotate on time

const cos = (n) => {
n = Math.cos(n*Math.PI/180);
  return n;
}


const initRotation = () => {
const now = new Date();

  let angleSeconds = (now.getSeconds()* 6);
  let as = angleSeconds;
  let angleSmoothSeconds = (now.getSeconds() * 1000 + now.getMilliseconds()) * 6 / 1000;
  let ass = angleSmoothSeconds;
  //@ts-ignore
  curvedTextWidget2.startAngle = ass; // great, you introduced the arc :)
  //@ts-ignore
  textChars.style.opacity = Math.min(Math.max(cos(6*ass),0),1);// opacity inherited => chars
  // rotation in "auto" modus is understandably rather laggy. best to keep this for "fix"?
  //@ts-ignore
   myText2.style.fill = 256*256*Math.floor(255 *(360 - as)/360) + 256*Math.floor(255*as/360);
  requestAnimationFrame(initRotation);
}
requestAnimationFrame(initRotation);


clock.granularity = "seconds"

// Opacity
  clock.ontick = (evt) => {
  const now = new Date();
  let seconds = now.getSeconds();
  //flash on/off
  //@ts-ignore
  //curvedText2.opacity = (seconds % 2) = 0 ?  1 : 0; //cant reach curvedWidgetText2 from here

  //@ts-ignore
  textChars.style.opacity = (seconds % 2) == 0 ?  1 : 0;
  //console.log(textChars.style.opacity);
  curvedTextWidget1.startAngle = seconds*6;
  textChars.style.fill = "#18d6cd" ;// inherited => chars[i]

  //@ts-ignore
  //myText2.style.fill = 255*255*Math.floor((255 - 255)*seconds/60) + 255*Math.floor((0 + 255)*seconds/60) + Math.floor(255 - 255)*seconds/60;
};
// could also change colors, smooth or in ontick; font-size, I guess, position of the circle, radius.....
// TODO G 4.9 delete all unnecessary code (non-widget code, etc) from all files in this branch