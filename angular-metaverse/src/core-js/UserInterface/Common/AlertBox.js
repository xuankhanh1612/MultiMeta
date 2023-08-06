import { UiElement } from "../UiElement.js";

class AlertBox extends UiElement {
    constructor(title, content, accept = {title: "YES", icon: ""}, cancel = {title: "CANCEL", icon: ""}, onAccept = null){
        super({
            id: "AlertBox",
            style: {
                position: "absolute",
                top: "2%",
                left: "20%",
                textAlign: "center",
                background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(235,235,235,1) 48%, rgba(250,250,250,1) 100%)",
                boxShadow: "0 2px 2px #888888",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                zIndex: 100,
                width: "60%",
                height: "90vh"
            }
        })

        if(title) {
            this.title = new UiElement({
                innerHTML: title,
                style: {
                    background: "#d8d8d8"
                }
            });
            this.appendChild(this.title);
        } 

        this.msg = new UiElement({
            style: {
                margin: "20px",
                overflow: "auto",
                width: "auto",
                height: "95%"
            }
        });
        this.msg.appendDomChild(content);
        this.appendChild(this.msg);

        this.btnControl = new UiElement({});

        if(accept) {
            this.acceptButton = new UiElement({
                type: "button",
                innerHTML: accept.title + " " + accept.icon,
                style: {
                    padding: "10px",
                    margin: "10px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "10px",
                    background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(235,235,235,1) 48%, rgba(250,250,250,1) 100%)",
                    boxShadow: "0 2px 2px #888888",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.5s ease",
                    width: "100px"
                },
                onClick: () => {
                    this.element.remove();
                    if(onAccept) onAccept();
                }
            })
            this.btnControl.appendChild(this.acceptButton);
        }

        if(cancel) {
            this.cancelButton = new UiElement({
                type: "button",
                innerHTML: cancel.title + " " + cancel.icon,
                style: {
                    padding: "10px",
                    margin: "10px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "10px",
                    background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(235,235,235,1) 48%, rgba(250,250,250,1) 100%)",
                    boxShadow: "0 2px 2px #888888",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.5s ease",
                    width: "100px"
                },
                onClick: () => {
                    this.element.remove();
                }
            });
            this.btnControl.appendChild(this.cancelButton);
        }
        this.appendChild(this.btnControl);

        PARENT_VIEW.appendChild(this.element);
    }
}
export { AlertBox }