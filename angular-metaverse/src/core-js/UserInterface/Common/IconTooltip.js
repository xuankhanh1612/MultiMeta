import { UiElement } from "../UiElement.js";

class IconToolTip extends UiElement {
    constructor(icon, onAccept = null){
        super({
            type: "span",
            className: "material-icons",
            innerHTML: icon,
            hover: {
                cursor: "pointer",
            },
            onPointerDown: () => {
                if(onAccept) {
                    onAccept()
                }
            }
        })

        
    }
}
export { IconToolTip }