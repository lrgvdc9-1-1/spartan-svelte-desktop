 class User {

    constructor(uid, fname, mname, lname, email, icon, orga,orga_name, wcenter, active) {
        this.user_id    = uid;
        this.first_name = fname;
        this.middle_name = mname;
        this.last_name  = lname;
        this.email      = email;
        this.icon2       = icon;
        this.org_name   = orga_name
        this.organization_id = orga;
        this.work_center = wcenter;
        this.socket_id = 0;
        this.online = 0;
        this.active = active;
        this.me = false;
        this.splash = false;
        this.chat = false;
        this.editing = {form: "", section: "", attribute: ""}
    }

    get UID() {
        return this.user_id;
    }

    get IsMe() {
        return this.me;
    }

    set IsMe(value) {
        this.me = value;
    }
    get ONLINE() {
        this.online;
    }

    set ONLINE(value) {
        this.online = value;
    }

    get SOCKETID() {
        return this.socket_id;

    }

    set SOCKETID(value) {
        this.socket_id = value;
    }

    get FULL_NAME() {
        return this.first_name + " " + this.last_name;
    }
    
    get FNAME(){
        return this.first_name;
    }
    set FNAME(newName) {
        this.first_name = newName;
    }

    get MNAME(){
        return this.middle_name;
    }
    set MNAME(newName) {
        this.middle_name = newName;
    }

    get LNAME() {
        return this.last_name;
    }
    set LNAME(nwName) {
        this.last_name = nwName;
    }

    get EMLOWER() {
        return this.email.toLowerCase();
    }

    get EMAIL() {
        return this.email;
    }

    set EMAIL(email) {
        this.email = email;
    }

    get ICON() {
        this.icon2;
    }

    set ICON(icon) {
        this.icon2 = icon;
    }

    get ORGANIZATION() {
        return this.organization_id;
    }

    set ORGANIZATION(orga) {
        this.organization_id = orga;
    }

}

module.exports = User;