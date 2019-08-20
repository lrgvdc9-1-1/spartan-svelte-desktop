import IMask from 'imask';
export default class Tickets {
  

    constructor() {
        
        this.id_ticket      = 0;
        this.objectid       = 19050612;
        this.started_ticket = 0;
        this.created_date;
        this.cfirst_name = "";
        this.clast_name = "";
        this.cfull_name = "";
        this.telephone_land_line = "";
        this.alt_telephone ="";
        this.alt2_telephone ="";
        this.property_location;
        this.inside_city;
        this.pfull_name;
        this.pfirst_name;
        this.plast_name;
        this.subdivision;
        this.block_num;
        this.lot_num;
        this.tax_account_num;
        this.property_id;
        this.street;
        this.intersection;
        this.mailing_address;
        this.building_description;
        this.comments;
        this.full_address;
        this.add_num;
        this.prd;
        this.rd;
        this.sts;
        this.pod;
        this.unit;
        this.msag_comm;
        this.postal_comm;
        this.county;
        this.state;
        this.esn;
        this.exch;
        this.region;
        this.x;
        this.y;
        this.walk_in;
        this.view;       
        
        this.cemail = "";
        this.alt_cemail = "";
        this.prf_language;
        this.status;

        this.init;
        this.lat;
        this.longy;

      this.tele_object;
      this.alt_object;
      this.alt2_object

      this.listATT = {
          "inputFname" : this.cfirst_name
      }
    }

    setUpMask() {
      var maskOptions = {
               mask: '(000) 000-0000'
         };
        this.tele_mask = IMask(this.tele_object, maskOptions);
        this.alt_mask = IMask(this.alt_object, maskOptions);
        this.alt2_mask = IMask(this.alt2_object, maskOptions);
    }

    destroyMask() {
       this.tele_mask.destroy();
       this.alt_mask.destroy();
       this.alt2_mask.destroy();
    }

    addJson(json) {
      if(json) {
        this.id_ticket      = json.id_ticket;
        this.objectid       = json.objectid;
        this.started_ticket = json.started_ticket;
        this.created_date   = json.created_date;
        this.x              = json.x;
        this.y              = json.y;
        this.walk_in        = json.walk_in;
        this.view           = json.view;       
        this.cfirst_name    = json.cfirst_name;
        this.clast_name     = json.clast_name;
        this.cfull_name     = json.cfull_name;
        this.init           = json.init;
        this.lat            = json.lat;
        this.longy          = json.longy;

      }
    }
  
    sayHi() {
      alert(this.cfirst_name);
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
  }
  