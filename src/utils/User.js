export default class User {

    constructor() {
        this.user_id    = 0;
        this.first_name = "";
        this.last_name  = "";
        this.email      = "";
        this.icon       = "";
        this.organization_id = "";
    }

    get FNAME(){
        return this.first_name;
    }
    set FNAME(newName) {
        this.first_name = newName;
    }

    get LNAME() {
        return this.last_name;
    }
    set LNAME(nwName) {
        this.last_name = nwName;
    }

    get EMAIL() {
        return this.email;
    }

    set EMAIL(email) {
        this.email = email;
    }

    get ICON() {
        this.icon;
    }

    set ICON(icon) {
        this.icon = icon;
    }

    get ORGANIZATION() {
        return this.organization_id;
    }

    set ORGANIZATION(orga) {
        this.organization_id = orga;
    }

}