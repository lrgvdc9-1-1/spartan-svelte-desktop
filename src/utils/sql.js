export default class SQL {
    constructor(pool, api, client_status) {
        this.pool = pool;
        this.api = api;
        this.client_status = client_status;
    }

    isLocalAvailable() {
        return this.client_status;
    }

    getOrganizationTickets(organization_id, url = null) {
        if(this.client_status) {
            return this.pool.query(this.api['tickets']['organization'], [organization_id]);
            
        }else{
            return fetch(`${url}addressticket/getAllPendingTicketsByOrga2/?id=${organization_id}`);
        }
       
        
    }

    getTicketForm(sql, ticketId) {
        if(this.client_status) {
            return this.pool.query(sql, ticketId);
        }else {

        }
    }

    async getActiveUsers()
    {
        if(this.client_status) {
    
            return this.pool.query(this.api.users.active);
        }else{
            
        }
    }

    logMeIn(email) {
        if(this.client_status){
            return this.pool.query(this.api.users.authenticate, [email])            
        }
    }

    
   
}


