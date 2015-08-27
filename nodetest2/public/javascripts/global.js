// Userlist dta array for filling in info box
var userListData = [];


// DOM Ready ===================
$(document).ready(function(){
	//populate the user table on initial page load
	
	populateTable();
	$('#userList table tbody').on('click', 'td a.linkshowuser',showUserInfo);
	$('#userList table tbody').on('click', 'td a.linkdeleteuser',deleteUser);
	$('#btnAddUser').on('click', addUser);
	//var theUlTable = $('#ul').dataTable();
 	 
});

// functions ===============

// fill table with data 
function populateTable(){

	// Empty content string
	var tableContent ='';
 
 
	// jQuery AJAX call for JSON
	$.getJSON ('/users/userlist', function(data){
	
		userListData = data;
		$.each(data,function(){
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';

		});
		// Inject the whol content string into existing 
		 
		$('#userList table tbody').html(tableContent);
 
		//theUlTable.destroy();
 
		theUlTable = $('#ul').dataTable(
		 	{
		 		"order" : [[0 ,"desc"]] 
		 	}
	 		);

	});
};


// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

    // Get our user object
    var thisUserObject = userListData[arrayPosition];

    // populate info box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

}

function addUser(event){
	event.preventDefault();

	var errorCount=0;
	$('#addUser input').each(function(index,val){
		if ($(this).val() === '' ){
			errorCount++;
		}
	});
	if (errorCount===0){

		var newUser={
			'username' : $('#addUser fieldset input#inputUserName').val(),
			'email' : $('#addUser fieldset input#inputUserEmail').val(),
			'fullname' : $('#addUser fieldset input#inputUserName').val(),
			'age' : $('#addUser fieldset input#inputUserAge').val(),
			'location' : $('#addUser fieldset input#inputUserLocation').val(),
			'gender' : $('#addUser fieldset input#inputUserGender').val()
		}
	

		$.ajax({
			type:'POST',
			data: newUser,
			url: 'users/adduser',
			dataType: 'JSON'
		}).done(function(response){
			if (response.msg=== ''){
				$('#addUser fieldset input').val('');
				populateTable();
			}
			else{
				alert('Error: ' + response.msg);
			}
		});

	}
	else {
		alert('Please fill in all fields');
		return false;
	}
}

// Delete User
// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};




