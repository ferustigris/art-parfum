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

function addedProductReceive(result) {
    console.log('Product have been added')
    var product = $.parseJSON(result);
    $("#jsGrid").jsGrid("insertItem", product);
    dialog.dialog( "close" );
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
            height: window.innerHeight,

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
                asyncReceive("/data/removeProduct.json", function () {}, args.item)
            },
            onItemUpdated: function(args) {
                console.log("onItemUpdated")
                asyncReceive("/data/updateProduct.json", function () {}, args.item)
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
                    store: parseInt($("#new-product-store").val())
                }

                console.log("Try to create new product...")
                console.log(item)

                asyncReceive("/data/addNewProduct.json", addedProductReceive, item)
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

        asyncReceive("/data/products.json", productsReceive)
    });
});
