export default class SQL {
    constructor(client, api) {
        this.client = client;
        this.api = api;
    }

    isAvailable() {
        return this.client;
    }

    getOrganizationTickets(organization_id) {
        return this.client.query(this.api['tickets']['organization'], [organization_id]);
        
    }

    
   
}


