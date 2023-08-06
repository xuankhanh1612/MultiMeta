import { UiElement } from "../UiElement.js";

class NameTooltip extends UiElement {
    constructor(title){
        super({
            type: "button",
            style: { 
                marginTop: '-1em',
                padding: '5px',
                opacity: '1',
                background: 'gray',
                color: 'white',
                fontWeight: 'bold'
            },
            innerHTML: title,
            hover: {
                background: "rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
            }
        })
    }
}
export { NameTooltip }