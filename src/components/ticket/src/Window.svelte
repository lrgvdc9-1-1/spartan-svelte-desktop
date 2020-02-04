<script>
    export let title;
</script>
<style>
   .bg-indian-red {
      background-color: #D55441 !important;
   }
   .title {
      text-align: center;
   }
</style>

 <div class="window">
      <div class="window-caption bg-indian-red">
         
         <span class="title">{title}</span>
         <!-- <div class="buttons">
               <span class="btn-min"></span>
               <span class="btn-max"></span>
               <span class="btn-close"></span>
         </div> -->
      </div>
    <div class="window-content p-2">
        <slot></slot>
    </div>

</div>