//The SQL file class is to handle all the local transactions with database.
export default class SQL {
    constructor(pool, api, client_status) {
        this.pool = pool;
        this.api = api;
        this.client_status = client_status;
    }

    isLocalAvailable() {
        return this.client_status;
    }

    getOrganizationNames(){
        console.log(this.api['company']['names']);
        return this.pool.query(this.api['company']['names'])
    }

    getOrganizationTickets(organization_id, url = null) {
        if(this.client_status) {
            return this.pool.query(this.api['tickets']['organization'], [organization_id]);
            
        }else{
            return fetch(`${url}addressticket/getAllPendingTicketsByOrga2/?id=${organization_id}`);
        }
    }

    getMyTickets(userId) {
        return this.pool.query(this.api['tickets']['mine'], [userId]);
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

    getTicketConnPropertyId(whereInfo) {
        if(this.client_status) {
            // console.log(whereInfo);
            // console.log(this.api['tickets']['connections']['propertyId'])
            return this.pool.query(this.api['tickets']['connections']['propertyId'], whereInfo);
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
        return this.pool.query(this.api.users.active);
    }

    getAttachments(whereInfo) {

        if(this.client_status) {
            return this.pool.query(this.api.tickets.attachments, whereInfo);
        }
    }

    getTicketStatus(whereInfo) {
        if(this.client_status) {
            return this.pool.query(this.api.tickets.routed, whereInfo)
        }
    }

    getRelTelePhone(whereInfo) {
        if(this.client_status) {
            return this.pool.query(this.api.tickets.connections.telephone, whereInfo);
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

    updateTicketFeed(values) {
        if(this.client_status) {
            return this.pool.query(this.api.tickets.updateComment, values);
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


