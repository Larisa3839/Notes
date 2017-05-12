$(document).ready(function(){

	function GetUsers() {
            $.ajax({
                url: "/api/users",
                type: "GET",
                contentType: "application/json",
                success: function (users) {
                    var rows = "";
                    $.each(users, function (index, user) {                  
                        rows += row(user);
                    })
                    $("table tbody").append(rows);
                 }
            });
        }

        function GetUser(id) {
            $.ajax({
                url: "/api/users/"+id,
                type: "GET",
                contentType: "application/json",
                success: function (user) {
                    var form = document.forms["userForm"];
                    //form.elements["id"].value = user._id;
                    form.elements["name"].value = user.name;
                    form.elements["age"].value = user.age;
                    form.elements["note"].value = user.note;
                }
            });
        }
  
        function CreateUser(userName, userAge, userNote) {
            $.ajax({
                url: "api/users",
                contentType: "application/json",
                method: "POST",
                data: JSON.stringify({
                    name: userName,
                    age: userAge,
                    note: userNote
                }),
                success: function (user) {
                    reset();
                    $("table tbody").append(row(user));
                }
            })
        }
   
        function EditUser(userId, userName, userAge, userNote) {
            $.ajax({
                url: "api/users",
                contentType: "application/json",
                method: "PUT",
                data: JSON.stringify({
                    id: userId,
                    name: userName,
                    age: userAge,
                    note: userNote
                }),
                success: function (user) {
                    reset();
                    console.log(user);
                    $("tr[data-rowid='" + user._id + "']").replaceWith(row(user));
                }
            })
        }
  

        function reset() {
            var form = document.forms["userForm"];
            form.reset();
            form.elements["id"].value = 0;
        }
  
        function DeleteUser(id) {
            $.ajax({
                url: "api/users/"+id,
                contentType: "application/json",
                method: "DELETE",
                success: function (user) {
                    console.log(user);
                    $("tr[data-rowid='" + user._id + "']").remove();
                }
            })
        }
     
        var row = function (user) {
            return "<tr data-rowid='" + user._id + "'><td>" + user.name + "</td>" +
                   "<td>" + user.age + "</td>" +
                   "<td><a class='editLink' data-id='" + user._id + "'>Изменить</a> | " +
                    "<a class='removeLink' data-id='" + user._id + "'>Удалить</a></td></tr>";
        }
  
        $("#reset").click(function (e) {
  
            e.preventDefault();
            reset();
        })
  
  
        $("form").submit(function (e) {
            e.preventDefault();
            var 
            	id = this.elements["id"].value;
                name = this.elements["name"].value;
                age = this.elements["age"].value;
                note = this.elements["note"].value;
            if (id == 0)
                CreateUser(name, age, note);
            else
                EditUser(id, name, age, note);
        });
  
       
        $("body").on("click", ".editLink", function () {
            var id = $(this).data("id");
            GetUser(id);
        })
    
        $("body").on("click", ".removeLink", function () {
            var id = $(this).data("id");
            DeleteUser(id);
        })

        GetUsers();
});