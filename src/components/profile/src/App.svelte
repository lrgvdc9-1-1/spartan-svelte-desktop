<script>
	import {onMount} from "svelte";
	
	let subtitle = '';
	let fileEle;
	let src;
	let lblEdit = "None";
	let url = "https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/users/getUserImage/?pic=";
	let isme = [];
	let user;
	let changepic = false;
	let working_tickets = 0;
	let working_worksheets = 0;

	let fname;
	let mname;
	let lname;
	let email;
	let company;

	let password;
	let password2;
	let countError = 0;

	$: full_name = (`${fname} ${mname} ${lname}`).trim();
	
	onMount(() => {
		//Setup the listener from the other windows....
		setupListener();
	});

	function setupListener(){
		ipc.on('profile-msg', (event, data) => {
			console.log(data);
			var myself = data.me;

			lblEdit = (myself.work_center == "ADMIN") ? "Edit Info" : "Viewing Info";

			if(data.myself || myself.user_id == data.userid) {
				lblEdit = "Edit Info"
				if(myself) {
					
					fname = myself['first_name'];
					mname = (myself['middle_name']) ? myself['middle_name'] : "";
					lname = myself['last_name'];
					email = myself['email'];
					src = `${url}${myself['icon2']}`;
					company = myself['org_name'];
					subtitle =  `${myself['org_name']} - ${myself['work_center']}`;
				}
			}else{
				handleUser(data.userid);
			}
		});
	}

	async function handleUser(userid) {
		let response = await fetch(`https://gis.lrgvdc911.org/php/spartan/api/v2/index.php/users/getUserById/?id=${userid}`)
		let json = await response.json();
		
		if(json.user) {
			user = json.user;
			//console.log(user);
			fname = user['first_name'];
			mname = (user['middle_name']) ? user['middle_name'] : "";
			lname = user['last_name'];
			email = user['email'];
			src = `${url}${user['icon2']}`;
			company = user['org_name'];
			subtitle = `${user['org_name']} - ${user['work_center']}`;
		}
	}
	

	function onClickImage() {
		
		if(lblEdit == "Edit Info") fileEle.click();
	}

	function onChange() {
		var reader = new FileReader();
    
		reader.onload = function(e) {
			console.log(e);
			console.log("file loaded");
			changepic = true;
		  src = e.target.result;
		  //fileEle.files = [];
		  fileEle.value = null;
		}
		if(fileEle.files.length > 0){
			reader.readAsDataURL(fileEle.files[0]);
		}
    	
	}

	function handleReset(){
		changepic = false;
		src = `${url}${user['icon2']}`;
	}

	function handleLoadError(e) {

			e.target.src = "./assets/spartan_logo.webp";

		
	}

</script>
<style>
	

	input[type="file"] {
		opacity: 0;
		width: 0;
		height: 0;
	}



	
	img:hover {
		cursor: pointer;
	}

	.social-box .header .av {
		position: absolute;
		width: 154px;
		height: 150px;
		border-radius: 50%;
		overflow: hidden;
		top: 100%;
		left: 50%;
		margin-top: -100px;
		margin-left: -65px;
		z-index: 2;
		border: 2px solid #fff;
	}

	.grid-container {
		display: grid;
		grid-template-columns: 90% 10%;
		grid-gap: 10px;
		height: 30px;
		
		
	}


</style>

	<div class="social-box">
			<div  class="header" style="margin:0 !important;color: white;background: #1a2c4d;">
				<input accept="image/*" on:change={onChange} bind:this={fileEle} type="file" />
				<img on:error={handleLoadError} on:click={onClickImage} {src} alt="" class="avatar">
				<div class="grid-container">
					<div class="title">{full_name}</div>
					<div id="btn">
						{#if changepic}
							<button on:click={handleReset} class="button primary">Reset</button>
						{/if}
					</div>
				</div>
				
				<div class="subtitle">{subtitle}</div>
				
			</div>
				<ul class="skills">
					<li>
						<div class="text-bold">{working_tickets}</div>
						<div>TICKETS</div>
					</li>
					<li>
						<div class="text-bold">{working_worksheets}</div>
						<div>SUBDIVISIONS</div>
					</li>
					<!-- <li>
						<div class="text-bold">36</div>
						<div>FILMS</div>
					</li> -->
				</ul>
			<hr >
			<div class="container">
					<h2>{lblEdit}</h2>
					{#if lblEdit == "Edit Info"}
						 <form>
								<div class="form-group">
									<label>First Name</label>
									<input bind:value={fname} type="text" placeholder="Enter First NAME"/>
								</div>
								<div class="form-group">
									<label>Middle Name</label>
									<input bind:value={mname} type="text" placeholder="Enter Middle NAME"/>
								</div>
								<div class="form-group">
									<label>Last Name</label>
									<input bind:value={lname} type="text" placeholder="Enter Last NAME"/>
								</div>
								<div class="form-group">
									<label>E-Mail (Username)</label>
									<input bind:value={email} type="text" placeholder="Enter E-Mail"/>
								</div>

								<div class="form-group">
									<label>Update Password</label>
									<input bind:value={password} type="text" placeholder="Enter E-Mail"/>
								</div>

								<div class="form-group">
									<label>Re-Enter Passwrod</label>
									<input bind:value={password2} type="text" placeholder="Enter E-Mail"/>
								</div>

								<div class="form-group">
									<button type="button" class="button primary">Update Profile</button>
								</div>
						</form>
					{:else}
						<table class="table striped" style="color: inherit;">
							<tbody>
							    <tr>
								 	<td>First Name</td>
									<td>{fname}</td>
								 </tr>
								  <tr>
								 	<td>Middle Name</td>
									<td>{mname}</td>
								 </tr>
								 <tr>
								 	<td>Last Name</td>
									 <td>{lname}</td>
								 </tr>
								 <tr>
								 	<td>E-mail</td>
									<td>{email}</td>
								 </tr>

								 <tr>
								 	<td>Organization</td>
									<td>{company}</td>
								 </tr>
							</tbody>
								
						</table>	
					
					{/if}
					
			</div>
			
</div>

