<script>
    import {onMount} from "svelte";

    export let objectid;

    onMount(()=> {

    });

    function getSQL() {
     
        var formInputs = document.getElementsByClassName("")
        let sql = "SELECT "
        for (var i = 0; i < this.formInputs.length; i++) {
          let target = this.formInputs[i];
          sql += `${target.getAttribute("id")}, `;
  
        }
        sql = sql.slice(0, -2);
        sql += " FROM addressticket where objectid = $1";
        console.log(sql);
        this.selectTicket = sql;
        return this.selectTicket;
      }
     
</script>
<h2>Connections</h2>