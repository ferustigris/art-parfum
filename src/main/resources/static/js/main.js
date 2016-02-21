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
            ],
            onItemDeleted: function(args) {
                console.log("onItemDeleted")
                // cancel editing of the row of item with field 'ID' = 0
                if(args.item.ID === 0) {
                    args.cancel = true;
                }
            },
            onItemUpdated: function(args) {
                console.log("onItemUpdated")
                // cancel editing of the row of item with field 'ID' = 0
                if(args.item.ID === 0) {
                    args.cancel = true;
                }
            }

        });

        dialog = $("#detailsDialog").dialog({
            autoOpen: false,
            width: 400,
            height: 350,
            modal: true,
            buttons: {
              "Create an product": function() {
                item = {
                    name: $("#new-product-name").val(),
                    code: $("#new-product-code").val(),
                    count: parseInt($("#new-product-count").val()),
                    store: parseInt($("#new-product-store").val()),
                    d0: 0,
                    d1: 0,
                    d2: 0,
                    d3: 0,
                    d4: 0,
                    d5: 0,
                    d6: 0
                }
                console.log("Try to create")
                console.log(item)
                $("#jsGrid").jsGrid("insertItem", item);
                dialog.dialog( "close" );
              },
              Cancel: function() {
                dialog.dialog( "close" );
              }
            },
            close: function() {
                $("#detailsForm").validate().resetForm();
                $("#detailsForm").find(".error").removeClass("error");
            }
        });

        $( "#add-new-product" ).button().on( "click", function() {
            dialog.dialog( "open" );
        });

        $("#detailsForm").validate({
            rules: {
                name: "required",
                code: { required: true, minlength: 2 },
                count: { required: true, range: [0, 1500] },
                store: "required"
            },
            messages: {
                name: "Please enter name",
                code: "Please enter valid code",
                count: "Please enter count",
                store: "Please select store"
            },
            submitHandler: function() {
                console.log("Try to submit")
            }
        });

        var formSubmitHandler = $.noop;
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
