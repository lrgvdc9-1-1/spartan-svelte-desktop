import IMask from 'imask';
export default class Tickets {
  

    constructor() {
        
      this.id_ticket      = 0;
      this.objectid       = 0;
      this.started_ticket = 0;
      this.created_date;
      this.selectTicket = null;
      this.formInputs = document.getElementsByClassName("inTicket");
      this.socket = null;
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
        if(element.tagName == "INPUT") {
          var attribute = element.getAttribute("id");
          var value = element.value;
          
          this.socket.emit("ticketViewer", {room: ticket.objectid,locked: true, value: value, attribute: attribute});
          console.log(`VALUE IS ${value} and attribute is ${attribute}`);
        }
    }

      onBlurElement(e) {
        let element = e.target;
        if(element.tagName == "INPUT") {
          var attribute = e.target.getAttribute("id");
          var value = e.target.value;
          this.socket.emit("ticketViewer", {room: this.objectid, locked: false, value: value, attribute: attribute});
          console.log(`lost focus VALUE IS ${value} and attribute is ${attribute}`);
        }
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
        this.selectTicket = sql;
        return this.selectTicket;
      }
     
  }

  updateForm(row) {
      if(row.length == 1) { 
         let attribute = row[0]
         for(var x in attribute) {
          
            document.getElementById(x).value = attribute[x];
         }
      }

      console.log(this.cfull_name);
  }
  
}