export default class SQL {
    constructor(client, api, client_status) {
        this.client = client;
        this.api = api;
        this.client_status = client_status;
    }

    isLocalAvailable() {
        return this.client_status;
    }

    getOrganizationTickets(organization_id, url = null) {
        if(this.client_status) {
            return this.client.query(this.api['tickets']['organization'], [organization_id]);
        }else{
            return fetch(`${url}addressticket/getAllPendingTicketsByOrga2/?id=${organization_id}`);
        }
       
        
    }

    getTicketForm(sql, ticketId) {
        if(this.client_status) {
            return this.client.query(sql, ticketId);
        }else {

        }
    }

    getActiveUsers()
    {
        if(this.client_status) {
            return this.client.query(this.api.users.active);
        }else{
            
        }
    }

    logMeIn(email) {
        if(this.client_status){
            if(this.client) {
                return this.client.query(this.api.users.authenticate, [email])
            }
            
        }
    }

    
   
}


