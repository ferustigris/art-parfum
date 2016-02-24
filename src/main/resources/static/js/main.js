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

function getDateInThePast(daysAgo) {
    var currentDate = new Date();
    return new Date(currentDate.getTime() - daysAgo * 24 * 60 * 60 * 1000);
}

function getDaysBetween(d) {
    var currentDate = new Date();
    return parseInt((currentDate.getTime() - d) / (24 * 60 * 60 * 1000));
}

function loadStore(store) {
    console.log("Current store ");
    console.log(store);

    // create fields in the table
    var fields = [
        { name: "code", type: "text", width: 100 },
        { name: "count", type: "number", width: 70 }
    ];

    for(i = $('#period').val() - 1; i >= 0 ; --i) {
        var d = getDateInThePast(i)
        fields.push({ name: "d" + i, title: d.toDateString(), type: "number", width: 70 });
    };

    $(function() {
        $( "#tabs" ).tabs({
            beforeLoad: function( event, ui ) {
                ui.jqXHR.fail(function() {
                    ui.panel.html("Couldn't load this tab");
                });
            }
        });
    });

    fields.push(
        { name: "balance", type: "number", width: 70 },
        { type: "control" }
    );

    // create table
    $("#jsGrid").jsGrid({
        width: "100%",
        height: window.innerHeight - 200,

        filtering: true,
        editing: true,
        sorting: true,
        paging: true,
        autoload: true,

        data: [],
        controller: {
            loadData: function(filter) {
                filter.store = store;
                return asyncReceive("/data/products.json", function (result) {
                    console.log('Products have been received');
                    var products = $.parseJSON(result);
                    products.forEach(function(item) {
                        asyncReceive("data/sales.json", function(result) {
                            var sales = $.parseJSON(result);
                            sales.forEach(function(sale) {
                                var i = getDaysBetween(sale.date);
                                item['d' + i] = sale.count;
                            });
                            console.log("edit item");
                            console.log(item);
                            item.store = store;
                            $("#jsGrid").jsGrid("insertItem", item);
                        }, {
                            'product': item.id,
                            'date': getDateInThePast(i).getTime(),
                            'store': store
                        })
                    })
                }, filter)
            }
        },

        fields: fields,
        onItemDeleted: function(args) {
            console.log("onItemDeleted");
            asyncReceive("/data/removeProduct.json", function () {}, args.item);
        },
        onItemUpdated: function(args) {
            console.log("onItemUpdated");
            asyncReceive("/data/updateProduct.json", function () {
                for(i = 0; i < $('#period').val(); ++i) {
                    asyncReceive("/data/updateSale.json", function () {
                        console.log("sale updated");
                    }, {
                        'product': args.item.id,
                        'store': store,
                        'day': i,
                        'count': args.item['d' + i]
                    });
                }
            }, args.item);
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
                store: store
            };

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
}

$(document).ready(function () {

    asyncReceive("data/stores.json", function (result) {
        console.log('Stores have been received')
        var stores = $.parseJSON(result);

        $('#period').selectmenu();
        $('#storesEl');
        var storesEl = $("#storesEl");
        storesEl.empty();
        stores.forEach(function(store) {
            storesEl.append('<option value="' + store.id + '">' + store.name + '</option>');
        });
        storesEl.selectmenu({
            change: function( event, data ) {
                console.log("loadStore");
                loadStore(data.item.value);
            }
        });

        loadStore(stores[0].id);
    });
});
