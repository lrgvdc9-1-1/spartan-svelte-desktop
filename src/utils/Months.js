export const  Months = [ "January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];
export const WeekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


export const CalendarPage = function(date, currentMonth) {
    this.date = date;
    this.ref = new Date();
    this.currentMonth = currentMonth
    this.choosen = false;
    this.index = -1;
    this.today = (this.date.getDate() == this.ref.getDate() && this.date.getMonth() == this.ref.getMonth() && 
    this.date.getFullYear() == this.ref.getFullYear()) ?  true : false;   
    this.outside = (this.date.getMonth() == this.currentMonth) ? false : true;
    this.getDate = () => {
        return this.date;
    }

    this.checkChoosen = (choosen) => {

        if(!choosen) {return this.choosen;}

        if(this.date.getMonth() == choosen.getMonth() 
        && this.date.getFullYear() == choosen.getFullYear() 
        && this.date.getDate() == choosen.getDate()) {
                this.choosen = true;
        }

        return this.choosen;
    }

    this.getDay = () => {
        return this.date.getDate();
    }
}