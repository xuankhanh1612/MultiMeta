class UiElement { 
    constructor(options) {
        const defaultOptions = {
            type: "div", 
            id: undefined,
            style: {},
            attributes: {},
            className: undefined,
            hover: undefined,
            onClick: undefined,
            onPointerDown: undefined,
            innerHTML: undefined
        }

        // set empty options to their default values
        for (let option in defaultOptions) {
            options[option] = typeof options[option] === 'undefined' ? defaultOptions[option] : options[option];
        }

        this.options = options;
    
        // Create the element and assign id
        this.element = document.createElement(options.type);
        if(typeof options.id !== "undefined") {
            this.element.id = options.id;
        }

        if(typeof options.className !== "undefined") {
            this.element.className = options.className;
        }

        // apply the style
        Object.assign(this.element.style, options.style);

        //aply attributes
        Object.assign(this.element, options.attributes);
        
        // if something is defined in the hover, add event listeners
        if(typeof options.hover !== "undefined"){
            this.element.addEventListener("mouseenter", () => {
                Object.assign(this.element.style, options.hover);
            })
            this.element.addEventListener("mouseleave", () => {
                Object.assign(this.element.style, options.style);
            })
        }

        // if something is defined in the onClick, add the event listener
        if(typeof options.onClick !== "undefined"){
            this.element.addEventListener("click", options.onClick)
        }
        // this.element.addEventListener("click", () => {console.log(this.element.id)})
        if(typeof options.onMouseDown !== "undefined"){
            this.element.addEventListener("mousedown", options.onMouseDown)
        }

        if(typeof options.onPointerDown !== "undefined"){
            this.element.addEventListener("pointerdown", options.onPointerDown)
            // this.element.removeEventListener("pointerdown", options.onPointerDown)
        }

        if(typeof options.innerHTML !== "undefined"){
            this.element.innerHTML = options.innerHTML;
        }
    }

    appendChild(uiElement) {
        this.element.appendChild(uiElement.element);
    }

    appendDomChild(domElement) {
        this.element.appendChild(domElement);
    }

    appendChildList(uiElementList) {
        uiElementList.forEach(uiElement => {
            this.element.appendChild(uiElement.element);
        })
    }
}
export { UiElement }