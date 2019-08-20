<script>
    import {  Link } from 'svero';
</script>
<style>
    [class*=mif-] {
    color: #E52888;
}
.text-light{
  color: #912E60;
  text-align: center;
}
.login-form {
    width: 28rem;
    height: 18.65rem;
    position: fixed;
    top: 50%;
    margin-top: -9.375rem;
    left: 34%;
    margin-left: -12.5rem;
    background-color: #ffffff;
   
    -webkit-transform: scale(.8);
    transform: scale(.8);
}
    a {
    cursor: pointer;
    color: #0366d6 !important;
    }

    a:hover{color:#0056b3 !important;text-decoration:underline !important}
    
	.bgbody{
		width:100%;
		height: 100vh;
		background-color: #303030;
		background-image: url("../../assets/bg-pattern.png");
	}
    input {
        cursor: pointer !important;
    }
</style>
<div class="bgbody">
    <form class="login-form  bg-white p-6 padding20 block-shadow mx-auto border bd-default win-shadow"
          >
          <div style="position: absolute;top: 1.8px; z-index: 1000">
            <img src="assets/public_safety_logo.webp" width="85" height="85" alt="">
          </div>
        <span class="mif-vpn-lock mif-4x place-right" style="margin-top: -10px;"></span>
        <h2 class="text-light">SpartanPro V4</h2>
        <hr style="color: #C12F79;" class="thin mt-4 mb-4 ">
        <div class="form-group">
            <input type="text" data-role="input" data-prepend="<span class='mif-envelop'>" placeholder="Enter your email..." data-validate="required email">
        </div>
        <div class="form-group">
            <input type="password" data-role="input" data-prepend="<span class='mif-key'>" placeholder="Enter your password..." data-validate="required minlength=6">
        </div>
        <div class="form-group mt-10">

            <div class="place-right">
                <input type="checkbox" data-role="checkbox" data-caption="Remember me" >
                <span> Remember Me</span>
                <br>
                <Link>Forgot Password</Link>
            </div>
           
            <button class="button">Login</button>
        </div>
    </form>
</div>
