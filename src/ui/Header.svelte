<style>
    #titlebar {
	display: block;
	position: fixed;
  width: 100%;
  height: 38px;
  background: #05173F;
  z-index: 2;
  border-bottom: 2px solid #CAB448;
  }

  #titlebar #drag-region {
    width: 100%;
    height: 100%;
    cursor: grab;
    -webkit-app-region: drag;
  }
  #titlebar {
    color: #FFF;
  }
  #titlebar #drag-region {
    display: grid;
    grid-template-columns: 80px auto 125px 138px;
  }
  #window-title {
    grid-column: 2;
    display: flex;
    align-items: center;
    bottom: 8px;
    
  
  }


  #window-icon {
    grid-column: 1;
    display: flex;
    align-items: center;
    margin-left: 8px;
  }

   #window-title span {
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
  }
  #window-controls {
    display: grid;
    grid-template-columns: repeat(4, 46px);
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    font-family: segoe;
    font-size: 10px;
  }
  #window-controls {
    -webkit-app-region: no-drag;
  }
  #window-controls .button {
    grid-row: 1 / span 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }



  #window-controls .button {
    user-select: none;
    color: #BBB;
    background: transparent;
  }
  #window-controls .button:hover {
    background: rgba(255,255,255,0.2);
    color: #FFF;
    cursor: pointer;
  }

  #window-controls #min-button {
    grid-column: 3;
  }
  #window-controls #max-button, #window-controls #restore-button {
    grid-column: 4;
  }
  #window-controls #restore-button {
    display: none;
  }
  #window-controls #close-button {
    grid-column: 5;
  }
  #window-controls #close-button:hover {
    background: #E81123;
  }
</style>
<header id="titlebar">
      <div id="drag-region" style="cursor: grab !important;">
        <div id="window-icon">
          <img width="50" height="50" src="./assets/spartan_logo.webp" alt="Spartan Logo">
        </div>
        <div id="window-title">
         
          <span>Spartan Pro Desktop</span>
           
        </div>

         
         

        <div id="window-controls">
          
        

          <div class="button" id="min-button">
            <span>&#xE921;</span>
          </div>
          <div class="button" id="max-button">
            <span>&#xE922;</span>
          </div>
          <div class="button" id="restore-button">
            <span>&#xE923;</span>
          </div>
          <div class="button" id="close-button">
            <span>&#xE8BB;</span>
          </div>
        </div>
      </div>
    </header>