$(document).ready(function() {
    const validateName = (name) => /^[a-zA-Z]+( [a-zA-Z]+)*$/.test(name.trim()); // valid input
    const btnAdd = $("#btn-add");
    let loadData = []; // our data
    let edtingUserId = null; // track the User being edited

    const cols = [
        {
            field: "id",
            title: "#",
        },
        {
            field: "name",
            title: "Name",
        },
        {
            field: "action",
            title: "Actions",
            formatter: actionFormatter,
        }
    ];

    $("#tbl-data").bootstrapTable({
        columns: cols,
        data: loadData
    });

    function actionFormatter() {
        return `
            <button type="button" class="btn-edit btn btn-info btn-sm text-white "><i class="fa-regular fa-pen-to-square"></i></button>
            <button type="button" class="btn-delete btn btn-error btn-sm text-white "><i class="fa-solid fa-trash"></i></button>`;
    }

    //add user event
    btnAdd.click(function(e) {
        e.preventDefault();
        let txtName = $("#txtName").val().trim();
            if (validateName(txtName)) { //if name is correct
                if (txtName) { 
                    if (edtingUserId == null) { 
                        const newUser = {
                            id: loadData.length + 1,
                            name: txtName
                        };
                            loadData.push(newUser);
                            $("#tbl-data").bootstrapTable('load', loadData); // Reload the table
                            $("#txtName").val("");
                            $(".error-message").empty(); // Clear any existing error message
                    } else {
                        showAlert("Updating","Do you want to update this user?",()=>{
                            let userIndex = loadData.findIndex(User => User.id === edtingUserId);
                            if (userIndex !== -1) {
                                loadData[userIndex].name = txtName;
                            }
                            $("#btn-add").text("Add");
                            edtingUserId = null;
                            $("#tbl-data").bootstrapTable('load', loadData); // Reload the table
                            $("#txtName").val("");
                            $(".error-message").empty(); // Clear any existing error message
                        },()=>{
                            console.log("do nothing")
                        })
                        
                    }
                }
            } else {
                createErrorLabel("Name must be more than 2 characters and contain no special symbols.");
            }
        
        

        // Check for name validation
        
    });
    function editUser(row) {
        $("#txtName").val(row.name); // Set the value of the input field
        edtingUserId = row.id; // Set the User being edited
    }
                                //btn class
    $("#tbl-data").on("click", ".btn-edit", function() { 
        btnAdd.text("UPDATE");
        let rowIndex = $(this).parents("tr").index();//getting row index
        let row = loadData[rowIndex]; // asign row above to our empty [] 
        editUser(row);
    });

    

    function deleteUser(UserId) {
        loadData = loadData.filter(User => User.id !== UserId); // Remove User by ID
        $("#tbl-data").bootstrapTable('load', loadData); // Reload the table
    }

    $("#tbl-data").on("click", ".btn-delete", function() {
        showAlert("DELETE","Do you want to delete this user ?",()=>{
            let rowIndex = $(this).parents("tr").index();
            let row = loadData[rowIndex];
            deleteUser(row.id);
            $("#btn-add").text("Add User");
            $("#txtName").val("");
            edtingUserId = null; //set back to null
            $(".error-message").empty(); //removing any error message
        },()=>{
            console.log("do nothing")
        })
         // Clear error message on delete
    });






    // Function to create an error label inside the .error-message div
    const createErrorLabel = (message) => {
        let errorMessage = $(".error-message");
        errorMessage.empty(); // Clear previous error messages

        let errorLabel = $("<div>").addClass("error-label text-red-500 text-xs md:text-sm "); //create div
        errorLabel.text(message);
        errorMessage.append(errorLabel);
    };

    const removeErrorLabel = () => {
        $(".error-message").empty(); // Clear the error message
    };

    const checkInput = (field) => {
        if (field === $("#txtName")[0] && !validateName(field.value)) {
            createErrorLabel("Name must be more than 2 characters and contain no special symbols.");
            field.classList.add("border-red-500", "focus:border-red-500", "focus:ring-red-500");
            field.classList.remove("border-green-500", "focus:border-green-500", "focus:ring-green-500");
        } else {
            removeErrorLabel();
            field.classList.add("border-green-500", "focus:border-green-500", "focus:ring-green-500");
            field.classList.remove("border-red-500", "focus:border-red-500", "focus:ring-red-500");
        }
    };

    const checking_txtbox = () => {
        $("#txtName").on("input", function() {
            checkInput(this);
        });
    };

    checking_txtbox();
});
// alert
const showAlert = (title, message, onConfirm = null, onCancel = null) => {
    // Create a container for the alert
    const $alertContainer = $('<div>') //create element
      .addClass("fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50");
  
    // Create the alert box
    const $alertBox = $('<div>')
      .addClass("bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full");
  
    const $alertTitle = $('<h1>')
      .text(title)
      .addClass("text-slate-800 text-xl font-bold mb-4");
    $alertBox.append($alertTitle);
  
    // Add the message
    const $alertMessage = $('<p>')
      .text(message)
      .addClass("text-gray-800 text-lg mb-4");
    $alertBox.append($alertMessage);
  
    // Add "Yes" and "No" buttons for confirmation alerts
    const $buttonContainer = $('<div>').addClass("flex justify-center space-x-4");
  
    if (onConfirm && onCancel) {
      // "Yes" button
      const $yesButton = $('<button>')
        .text("Yes")
        .addClass("bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600")
        .on("click", () => {
          $alertContainer.remove();
          if (onConfirm) onConfirm(); // Call the confirm action
        });
      $buttonContainer.append($yesButton);
  
      // "No" button
      const $noButton = $('<button>')
        .text("No")
        .addClass("bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600")
        .on("click", () => {
          $alertContainer.remove();
          if (onCancel) onCancel(); // Call the cancel action
        });
      $buttonContainer.append($noButton);
    } else {
      // "OK" button for regular alerts
      const $okButton = $('<button>')
        .text("OK")
        .addClass("bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600")
        .on("click", () => {
          $alertContainer.remove();
        });
      $buttonContainer.append($okButton);
    }
  
    $alertBox.append($buttonContainer);
  
    // Append the alert box to the container
    $alertContainer.append($alertBox);
  
    // Append the alert container to the body
    $('body').append($alertContainer);
  };
  
