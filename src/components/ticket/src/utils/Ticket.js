//THIS TICKET CLASS HANDLES ALL THE HTML ELEMENTS...
//SAVES ALL THE DB USERS...
//PROCESS THE RAW DATA .
//SAVES THE RAW DATA IN VARIABLE...
export default class Ticket {

    constructor() {
        this.inputsElements = [];
        this.data = null;
        this.spartans = null;
    }

    //MODULE: HOLD ALL USERS FROM DB...
    set SPARTANS(users){
        this.spartans = users;
    }

    //MODULE: GET ELEMENTS FROM CLASS..
    set ELEMENTS(lookup){
        this.inputsElements = document.getElementsByClassName(lookup) || [];
    }
    get ELEMENTS(){
        return this.inputsElements;
    }


    //SET DATA RAW DATA ON PLACEHOLDER..
    set DATA(info) 
    {
        this.data = info;
    }

    //GET THE CURRENT RAW DATA...
    get RECORDS() {
        return this.data
    }


    //MODULE: GET ATTRIBUTES FROM ID from ELEMENTS...
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

    //Conversion of Date object if needed...
    convertDate(val) {
        if(val instanceof Date){
            var yyyy = val.getFullYear();
            var mm   = (val.getMonth() + 1 < 10) ? `0${val.getMonth()+ 1}` : val.getMonth() + 1;
            var dd   = (val.getDate() < 10) ? `0${val.getDate()}` : val.getDate();
            return `${yyyy}-${mm}-${dd}`;
        }

        return val;
    }


    //MODULE: Handles all the data from DB insert into HTML elements...
    processData() 
    {
        //Loop through all the inputs and 
        //decide if check box if not input 
        for(var x in this.data) {
            var elem = document.getElementById(x);
           // console.log(elem.dataset);
            var type = elem.type;

            //If the attribute has the word date..
            //Assuming is the date object..
            if(x.indexOf("date") != -1){
                elem.value = this.convertDate(this.data[x])
                continue;
            }

            //Check the type of element 
            //If checkbox we have to change the 1 or 0 into true or false...

            if(type == "checkbox") {//Check box Is save as 1 or 0 on database..
                 //If is 1 true for check if not false for zero.
                 elem.checked = (this.data[x] == 1) ? true : false;
                 continue; //Skip to the next iteration since there is no value property.   
            }

            if(elem.dataset.check && elem.dataset.check == 1 && this.spartans) {
                this.spartans.forEach(user => {
                    console.log(user);
                    if(user.user_id == this.data[x]){
                        elem.value = user.first_name + " " + user.last_name;
                        return;
                    }
                });
                continue;
            }
            
            //If is regular text field or number save it into the input or select element...
            elem.value = this.data[x];
         }
    }

}