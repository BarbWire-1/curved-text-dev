Installation
=
/app
-
Copy the complete `/app/widgets` folder  into your project's `/app` folder\
 (so that you then have an `/app/widgets` folder in your project).


/resources/widgets
-
Copy the complete `/resources/widgets` folder  into your project's `/resources` folder\
(so that you then have a `/resources/widgets` folder in your project).

In your `/resources/widget.defs` file, within the `<defs>` section, add the following lines:

>`<link rel="stylesheet" href="widgets/curved-text/styles.css" />`

>`<link rel="import" href="widgets/curved-text/index.view" />`

/resources/index.gui (or .view)
-
In your `/resources/index.view` file, include `<use>` elements for every instance of curved-text that you want. Your `<use>` elements must include `href="#curvedText"`, and you'll need to give each element an id; *eg*, `id="stepsCurvedText"` like:
  >`<use id="myLabel" href="#curvedText" >`

See detailed documentation below, and examples in this repository.

>**Note:** Unlike most Fitbit elements and components, widgets won't be visible just because you've included them in your `.view` file. Widgets need some internal code to be executed to lay them out, and this doesn't happen until you get a reference to them using `document.getWidgetById()` in your code (see below).

/app/index.js (or .ts)\
Imports and setup
-
In your `/app/index.js` (or `.ts`) file, add the following two import statements near the top:
> `import widgetFactory from './widgets/widget-factory'`

> `import curvedText from './widgets/curved-text'`

If you haven't already got an `import` statement for `document`, add that too.

In your `/app/index.js` (or `.ts`) start-up code:

* Create a variable for a `widgetFactory` object, and tell it about curved-text widgets, like this:
> `const widgets = widgetFactory([curvedText]);`

* Use the ```widgetFactory``` object to add a `getWidgetById()` function to your `document` variable, like this:
> `widgets.registerContainer(document);`\

>**Note:** You can also add `getWidgetById()`to other container elements, such as `svg`, `section` and `g`. To do so, use `getElementById()` to get an object for the container element, then pass that to `registerContainer()`. You can call `registerContainer()` multiple times, or pass multiple arguments in one call. You don't have to use it on the `document` object if you always intend to get widgets from within subordinate container elements.

In order to use `curved-text` and `widget-factory` in your typescript project, please follow the additional instructions here: [typescript_interface](typescript.md).

Your code
=
Now, elsewhere in your `/app/index.js` (or `.ts`) file, you can get objects that correspond to the curved-text `<use>` elements in your `index.view` file, like this:
>`const myLabel = document.getWidgetById('myLabel');`\
>`const myClass = document.getElementsByClassName('myClass');`\
>**Note:** Accessing widgets by className requires that each widget has been previously created using `.getWidgetById()`. Hopefully this limitation will be fixed in future.)

In your code, use your widget object(s) to interact with the corresponding curved-text element; *eg*:

> `myLabel.text = today.adjusted.steps;`

Attributes
=
Set up the curve your text gets aligned at:
 -
 * x (horizontal center of curve)
 * y (vertical center of curve)
 * r (use r < 0 for bottom curved text; default is 100)

 Attributes to set text and style
 -
 * text (API) and text-buffer (SVG and CSS) (maximum length: 25 characters)
 * font-family
 * font-size
 * fill (default: black)
 * letter-spacing (pixels; default is 0; only gets applied in mode `auto`)
 * text-anchor ("start", "middle" or "end"; defaults to "middle")
 * opacity
 * display

 Rotation
 * sweep-angle (setting `sweep-angle` automatically switches to mode `fix` and rotates each char by += sweep-angle)
 * start-angle (sets the anchor position around the curve; defaults to 0° for r>=0, and 180° for r<0)

This table summarises the properties and settings that are available, and where they can be set. For more detail, see [code snippets](snippets.md).

!<div align="center">![set/call](interface_table.png)</div>

Limitations
=
* 'getters' are not implemented for API properties (text, startAngle, anchorAngle). Therefore, those properties are write-only.
* The widget inherits behaviour from GraphicsElement. While this provides a lot of capability without requiring additional code in the widget, it also means that some standard GraphicsElement functions (eg, getBBox) may not work as expected.
* The code targets SDK5. It will require the standard modifications to work in earlier SDKs.
* The factory and curved-text widget have not been testing in a dynamic GUI (ie, using `document.location` manipulation).
* Changing a `curved-text`'s `className` using `.class` will need great care. The `className` must start with the widget's class type identifier, or it will be invisible to the `widget-factory` and may not get necessary styles applied.
* Calling `getWidgetById()` multiple times on the same element will result in an error.