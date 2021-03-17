class MenuControl {
  constructor(controlName) {
    this.controlName = controlName;
    this.div = document.createElement("div");
    this.div.id = this.controlName + "Container";
    this.div.classList.add("menuContainer");
    this.submenus = {};
    }

  addDropdown(text) {
    var div = document.createElement("div");
    div.id = this.controlName + "Dropdown";
    div.classList.add("menuDropdown");
    div.innerHTML = text;
    div.addEventListener("click", () => { var elem = document.getElementById(this.controlName + "MenuItems"); (elem.style.display=="none")?elem.style.display="block":elem.style.display="none"; })
    var img = document.createElement("img");
    img.classList.add("menuArrow");
    img.src = "arrow-down.png";
    div.appendChild(img);
    var items = document.createElement("div");
    items.id = this.controlName + "MenuItems";
    items.classList.add("menuItems");
    this.div.appendChild(div);
    this.div.appendChild(items);
    this.items = items;
    return this.div;
    }

  addMenuItem(text,action,parent = null) {
    var item = document.createElement("div");
    item.classList.add("menuItem");
    item.innerHTML = text;
    item.addEventListener("click", (evt)=>{  action(); evt.stopPropagation(); });
    if (parent != null) { item.style.display = "none"; }
    (parent==null?this.items:parent).appendChild(item);
    return item;
  }

  addSubMenu(name,text, parent = null) {
    if (name in this.submenus) {
      return this.submenus[name];
    }
    var item = document.createElement("div");
    item.classList.add("menuItem");
    item.innerHTML = text;
    item.addEventListener("click",()=>{this.toggleChildren(item);});
    this.submenus[name]=item;
    (parent==null?this.items:parent).appendChild(item);
    return item;
    }

  subMenuNamed(name) {
    return this.submnenus[name];
    }

  toggleChildren(parent) {
    var i;
    var children = parent.children;
    for(i=0; i<children.length;i++) {
      children[i].style.display=(children[i].style.display=="block"?"none":"block") } }

  addRadio(groupId,text,selected,action) {
    var item = document.createElement("div");
    item.classList.add("menuItem");
    var radio = document.createElement("input");
    radio.type = "radio";
    radio.name = groupId;
    if (selected) { radio.checked = "true"; }
    var label = document.createElement("label");
    label.innerHTML = text;
    item.addEventListener("click",() => { radio.checked = true; document.getElementById(this.controlName + "MenuItems").style.display="none"; action(); });
    item.appendChild(radio);
    item.appendChild(label);
    this.items.appendChild(item);
  }

  addCheckbox(text,selected,action) {
    var item = document.createElement("div");
    item.classList.add("menuItem");
    var check = document.createElement("input");
    check.type = "checkbox";
    if (selected) { check.checked = "true"; }
    var label = document.createElement("label");
    label.innerHTML = text;
    item.addEventListener("click",() => { check.checked = !check.checked; this.hide(); action(check.checked); });
    item.appendChild(check);
    item.appendChild(label);
    this.items.appendChild(item);
  }

  hide() {
    this.items.style.display="none";
  }

}

