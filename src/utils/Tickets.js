import IMask from 'imask';
let _self;
export default class Tickets {


    constructor() {
      this.id_ticket      = 0;
      this.objectid       = 0;
      this.started_ticket = 0;
      this.created_date;
      this.selectTicket = null;
      this.formInputs = document.getElementsByClassName("inTicket") || [];
      this.socket;
      this.tele_object;
      this.alt_object;
      this.alt2_object;
      this.ogData;
      this.full_address;
      this.sql;
      this.address_by; //Element HTML
      this.address_issued_by; //ELement HTML
      this.verified_by; //HTML ELEMENT
      this.property_id;
      
      _self = this;
    }

    set SQL(sql) {
      this.sql = sql;
    }
    set SOCKET(socket) {

      this.socket = socket;
    }
    copy() {
    
       var input = document.getElementById(this.dataset.copy);
       input.select();
       document.execCommand('copy');
       setTimeout(() => {
        input.blur();
       }, 100);
    }
    setOriginal(original) {
      this.ogData = original;
    }
    setSocket(socket) {
      this.socket = socket;
    }
    setUpMask() {
      var maskOptions = {
               mask: '(000) 000-0000'
         };
        this.tele_mask = IMask(this.tele_object, maskOptions);
        this.alt_mask = IMask(this.alt_object, maskOptions);
        this.alt2_mask = IMask(this.alt2_object, maskOptions);
    }

    setUpInputsEvent() {
      
        for (var i = 0; i < this.formInputs.length; i++) {
          this.formInputs[i].addEventListener('focus', this.onKeyPressElement, false);
          this.formInputs[i].addEventListener('keyup', this.onKeyPressElement, false);
          this.formInputs[i].addEventListener('blur', this.onBlurElement, false);
      }
    }

    destroyInputsEvent() {

         for (var i = 0; i < this.formInputs.length; i++) {
           
            this.formInputs[i].removeEventListener('focus', this.onKeyPressElement, false);
            this.formInputs[i].removeEventListener('keyup', this.onKeyPressElement, false);
            this.formInputs[i].removeEventListener('blur', this.onBlurElement, false);
         }
    }

    destroyMask() {
       this.tele_mask.destroy();
       this.alt_mask.destroy();
       this.alt2_mask.destroy();
    }

      onKeyPressElement(e) {
        //console.log(e);
        let element = e.target;
        if(element.tagName == "INPUT" || element.tagName == "SELECT") {
          var attribute = element.getAttribute("id");
          var section   = element.dataset.section;
          var title     = element.dataset.title;
          var value = element.value;
            if(_self.socket) {
             
              _self.socket.emit("ticketViewer", {room: _self.objectid,locked: true, section: section,title: title,  value: value, elemID: attribute});
              console.log(`VALUE IS ${value} and attribute is ${attribute}`);
            }
          
        }
    }

      onBlurElement(e) {
        let element = e.target;
        if(element.tagName == "INPUT" || element.tagName == "SELECT") {
            var attribute = element.getAttribute("id");
            var type      = element.type;
            var section   = element.dataset.section;
            var title     = element.dataset.title;
            var trigger   = element.dataset.trigger;
            var value = e.target.value;
            let statement = `UPDATE addressticket SET ${attribute} = $1 where objectid = $2`;
            
           if(type == "checkbox") {
             value = (element.checked) ? 1 : 0;
           }

            //for date it can't be empty...
            if(!trigger) {
              if(attribute.includes("date")) { 
                if(value) {
                  let sql = {statement: statement, values: [value, _self.objectid]};
                  _self.sql.updateTicket(sql).then(res => {console.log(`VALUE UPDATED ${attribute}`)}) // brianc
                  .catch(err => console.error('Error executing query', err.stack))
                }
              }else { //Anything else we can send it...
                  let sql = {statement: statement, values: [value, _self.objectid]};
                  _self.sql.updateTicket(sql).then(res => {console.log(`VALUE UPDATED ${attribute}`)}) // brianc
                  .catch(err => console.error('Error executing query', err.stack))
              }

            }
            
            
           

            if(_self.socket) {
              console.log(_self.objectid);
              value = (type == "checkbox") ? element.checked : value
              _self.socket.emit("ticketViewer", {room: _self.objectid, locked: false, value: value, title: title, section: section, elemID: attribute});
              console.log(`lost focus VALUE IS ${value} and attribute is ${attribute} is a checkbox ${type}`);
            }
        }
         
    }

    onUpdate(elem, value) {
      var attribute = elem.getAttribute("id");
     
      let statement = `UPDATE addressticket SET ${attribute} = $1 where objectid = $2`;
      let sql = {statement: statement, values: [value, _self.objectid]};

      this.sql.updateTicket(sql).then(res => {}) // brianc
      .catch(err => console.error('Error executing query', err.stack))
    
    }


    onClearFullAddress() {
      document.getElementById("full_address").value = "";
      
    }

    onGlueFullAddress(e) {
      let hno = document.getElementById("add_num").value;
      let prd = document.getElementById("prd").value;
      let rd  = document.getElementById("rd").value;
      let sts = document.getElementById("sts").value;
      let pod = document.getElementById("pod").value;

      document.getElementById("full_address").value = `${hno} ${prd} ${rd} ${sts} ${pod}`.replace(/\s+/g,' ').trim();
    }

  
    changeValue(byId, value) {
     if(byId == "inputLname") {
        this.clast_name = value;
      }else if(byId == "inputTELE") {
        this.telephone_land_line = value;
      }
    }

    fetchTicketNumber(api) {
      let endpoint = "addressticket/getTicketNumber";
      return fetch(api + endpoint);
    }
    resetFormInputs(){
      this.formInputs = document.getElementsByClassName("inTicket");
    }
    getSQL() {
     
      if(this.selectTicket) {
        return this.selectTicket;
      }else {
        let sql = "SELECT "
        for (var i = 0; i < this.formInputs.length; i++) {
          let target = this.formInputs[i];
          sql += `${target.getAttribute("id")}, `;
  
        }
        sql = sql.slice(0, -2);
        sql += " FROM addressticket where objectid = $1";
        console.log(sql);
        this.selectTicket = sql;
        return this.selectTicket;
      }
     
  }

  formatDate(data) {
    if(data instanceof Date) {

      return `${data.getFullYear()}-${((data.getMonth() + 1) < 10 ? '0' + (data.getMonth() + 1) : (data.getMonth() + 1))}-${((data.getDate() < 10) ? '0' + data.getDate() : data.getDate())}`
    }

    return data;
  }

  updateForm(row) {
      if(row.length == 1) { 

         let attribute = row[0]
         for(var x in attribute) {
          
            var elem = document.getElementById(x);
            var type = elem.type;
           
            var skip = false;
            if(elem.dataset.check == 1) {
               skip = true;
            }

            if(type == "checkbox") {
              //if(x == "address_issued" || x == "letter_generated" || x == "plack_generated" || x == "called_cust"){
           
               elem.checked = (attribute[x] == 1) ? true : false;
               skip = true;
             // }
            }
          
            if(!skip) {
              elem.value = this.formatDate(attribute[x]);
            }else {
              if(attribute[x] != -1) {
                elem.value = this.formatDate(attribute[x]);
              }
            }
           
         }

         window.dispatchEvent(new Event('onTicketUpdate'));
      }

  }
  
}