export default class Ticket {

    constructor() {
        this.inputsElements = [];
        this.data = null;
    }

    set ELEMENTS(lookup){
        this.inputsElements = document.getElementsByClassName(lookup) || [];
    }

    set DATA(info) 
    {
        this.data = info;
    }
    get RECORDS() {
        return this.data
    }


    getSQL() {
        let lng = this.inputsElements.length;
        let sql = "SELECT "
        for (var i = 0; i < lng; i++) {
          let target = this.inputsElements[i];
          sql += `${target.getAttribute("id")}, `;
  
        }
        sql = sql.slice(0, -2);
        sql += " FROM addressticket where objectid = $1";
           
        return sql;
    }

    processData() 
    {
        //Loop through all the inputs and 
        //decide if check box if not input 
        for(var x in this.data) {
            var elem = document.getElementById(x);
            var type = elem.type;
            

            if(type == "checkbox") {//Check box Is save as 1 or 0 on database..
                 //If is 1 true for check if not false for zero.
                 elem.checked = (attribute[x] == 1) ? true : false;
                 continue; //Skip to the next iteration since there is no value property.
              
            }
            
            elem.value = this.data[x];
         }
    }

}