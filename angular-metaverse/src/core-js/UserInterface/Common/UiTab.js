import { UiElement } from "../UiElement.js";

class UiTab { 
    constructor(tabsJson) {
        this.tabsJson = tabsJson;

        this.element = document.createElement('div');
        this.element.id = 'company-list'
        let _this = this;

        //create element headers
        let tabHeaderDiv = document.createElement("div")
        tabHeaderDiv.className = 'tab';
        Object.assign(tabHeaderDiv.style, {
            overflow: 'hidden',
            border: '1px solid #ccc',
            backgroundColor: '#f1f1f1',
            marginTop: '2%'
        });

        this.tabsJson.forEach(function(obj) { 
            let btnHeader = new UiElement({
                type: 'button',
                innerHTML: obj.header,
                className: 'tablinks',
                style: {
                    backgroundColor: 'inherit',
                    float: 'left',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    padding: '14px 16px',
                    transition: '0.3s',
                    fontSize: '17px'
                },
                onPointerDown: (evt) => {
                    _this.openTab(evt, obj.header);
                }
            })

            tabHeaderDiv.appendChild(btnHeader.element);
        });

        this.element.appendChild(tabHeaderDiv);

        //create element content
        
        this.tabsJson.forEach(function(obj) {
            let tabContentDiv = document.createElement('div')
            tabContentDiv.id = obj.header;
            tabContentDiv.className = 'tabcontent';
            Object.assign(tabContentDiv.style, {
                display: 'none',
                textAlign: 'left',
                padding: '6px 12px',
                border: '1px solid #ccc',
                borderTop: 'none'
            });

            let inputSearch = document.createElement('input');
            inputSearch.id = 'myInput-' + obj.header;
            inputSearch.placeholder = "Searching...";
            Object.assign(inputSearch.style, {
                width: '100%',
                fontSize: '16px',
                padding: '12px 20px 12px 40px',
                border: '1px solid #ddd',
                marginBottom: '12px'
            });
            inputSearch.addEventListener('keyup', (evt) => {
                _this.searching(obj.header);
            });

            let ul = document.createElement('ul');
            ul.id = 'myUL-' + obj.header;
            let items = obj.items;
            
            items.forEach(i => {
                let li = new UiElement({
                    type: 'li',
                    innerHTML: '<h3>' + i + '</h3>',
                    hover: {
                        cursor: 'pointer'
                    },
                    onPointerDown: (evt) => {
                        
                    }
                })
                ul.appendChild(li.element);
            })

            tabContentDiv.appendChild(inputSearch);
            tabContentDiv.appendChild(ul);
            _this.element.appendChild(tabContentDiv);
        });

    }

    openTab(evt, tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
            tablinks[i].style.backgroundColor = 'inherit';
        }
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
        evt.currentTarget.style.backgroundColor = '#ccc';
    }

    searching(tabName) {
        // Declare variables
        var input, filter, ul, li, h3, i, txtValue;
        input = document.getElementById('myInput-' + tabName);
        filter = input.value.toUpperCase();
        ul = document.getElementById("myUL-" + tabName);
        li = ul.getElementsByTagName('li');

        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
            h3 = li[i].getElementsByTagName("h3")[0];
            txtValue = h3.textContent || h3.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }
}

export { UiTab }