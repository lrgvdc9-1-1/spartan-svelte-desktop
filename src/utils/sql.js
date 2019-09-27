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

    getTicketComFeedTotal(whereInfo) {
        if(this.client_status) {
            return this.pool.query(this.api['tickets']['feedTotal'], whereInfo);
        }else{

        }
    }

    getTicketComFeed(whereInfo) {
        if(this.client_status) {
            return this.pool.query(this.api['tickets']['feed'], whereInfo)
        }else {

        }
    }

     getActiveUsers()
    {
        if(this.client_status) {
    
            return this.pool.query(this.api.users.active);
        }else{
            
        }
    }


    ticketInsertComment(values) {
        if(this.client_status) {
            return this.pool.query(this.api.tickets.insertComment, values);
        }
    }

    updateTicket(sql) {

        if(this.client_status) {
            return this.pool.query(sql.statement, sql.values);
        }
    }

    delTicketCom(value) {
        if(this.client_status) {
            return this.pool.query(this.api.tickets.deleteComment, value);
        }
    }

    logMeIn(email) {
        if(this.client_status){
            return this.pool.query(this.api.users.authenticate, [email])            
        }
    }

    
   
}


