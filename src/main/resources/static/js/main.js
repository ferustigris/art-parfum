function productsReceive(result) {
    console.log('Products have been received')
    var json = $.parseJSON(result);
    json.forEach(function(item) {

        asyncReceive("data/salesGroupedByDate.json", function(result) {
            var sales = $.parseJSON(result);
            sales.forEach(function (sale, i) {
                item['d' + i] = sale.count;
            });
            console.log(item);

            item.store = item.store.id;
            $("#jsGrid").jsGrid("insertItem", item);
        }, {
            'code': item.code
        })
    })
}

function asyncReceive (url, receiver, data) {
    $.ajax({
        url: url,
        cache: false,
        dataType: "text",
        data: data,
        contentType:"application/json",
        error: function (result) {
            console.log('Receiving data from ' + url + ' failed')
        },
        success: receiver
    });
}

$(document).ready(function () {
    asyncReceive("data/stores.json", function (result) {
        console.log('Stores have been received')
        var stores = $.parseJSON(result);
        $("#jsGrid").jsGrid({
            width: "100%",
            height: "400px",

            filtering: true,
            editing: true,
            sorting: true,
            paging: true,

            data: [],

            fields: [
                { name: "code", type: "text", width: 100 },
                { name: "count", type: "number", width: 70 },

                { name: "d0", type: "number", width: 70 },
                { name: "d1", type: "number", width: 70 },
                { name: "d2", type: "number", width: 70 },
                { name: "d3", type: "number", width: 70 },
                { name: "d4", type: "number", width: 70 },
                { name: "d5", type: "number", width: 70 },
                { name: "d6", type: "number", width: 70 },

                { name: "balance", type: "number", width: 70 },

                { name: "store", type: "select", items: stores, valueField: "Id", textField: "Name" },
                { type: "control" }
            ]
        });

        $("#detailsDialog").dialog({
            autoOpen: false,
            width: 400,
            height: 300,
            modal: true,
            buttons: {
              "Create an account": function() {
                console.log(Creates)
              },
              Cancel: function() {
                dialog.dialog( "close" );
              }
            },
            close: function() {
                $("#detailsForm").validate().resetForm();
                $("#detailsForm").find(".error").removeClass("error");
            }
        }).dialog( "open" );

//        $("#detailsForm").validate({
//            rules: {
//                name: "required",
//                age: { required: true, range: [18, 150] },
//                address: { required: true, minlength: 10 },
//                country: "required"
//            },
//            messages: {
//                name: "Please enter name",
//                age: "Please enter valid age",
//                address: "Please enter address (more than 10 chars)",
//                country: "Please select country"
//            },
//            submitHandler: function() {
//                formSubmitHandler();
//            }
//        });
//
//        var formSubmitHandler = $.noop;
//
//        var showDetailsDialog = function(dialogType, client) {
//            $("#name").val("dsfdsf");
////            $("#age").val(client.Age);
////            $("#address").val(client.Address);
////            $("#country").val(client.Country);
////            $("#married").prop("checked", client.Married);
//
//            formSubmitHandler = function() {
//                saveClient(client, dialogType === "Add");
//            };
//
//            $("#detailsDialog").dialog("option", "title", dialogType + " Client")
//                    .dialog("open");
//        };
//
//        var saveClient = function(client, isNew) {
//            $.extend(client, {
//                Name: $("#name").val(),
//                Age: parseInt($("#age").val(), 10),
//                Address: $("#address").val(),
//                Country: parseInt($("#country").val(), 10),
//                Married: $("#married").is(":checked")
//            });
//
//            $("#jsGrid").jsGrid(isNew ? "insertItem" : "updateItem", client);
//
//            $("#detailsDialog").dialog("close");
//        };

        //showDetailsDialog("Edit");

        asyncReceive("/data/products.json", productsReceive)
    });
});
