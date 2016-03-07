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

function getCurrentDate() {
    var currentDate = new Date();
    return currentDate;
}

function getDateInThePast(daysAgo) {
    var currentDate = getCurrentDate();
    return new Date(currentDate.getTime() - daysAgo * 24 * 60 * 60 * 1000);
}

function getDaysBetween(d) {
    var currentDate = getCurrentDate();
    return parseInt((currentDate.getTime() - d) / (24 * 60 * 60 * 1000));
}

function loadStore(grid, store, datePeriod) {
    console.log("Current store ");
    console.log(store);

    // create fields in the table
    var fields = [
        { name: "code", title: _('Code'), type: "text", width: 100 }
    ];

    for(i = datePeriod - 1; i >= 0 ; --i) {
        var d = getDateInThePast(i)
        fields.push({ name: "d" + i, title: d.toLocaleDateString('ru-RU'), type: "number", width: 70 });
    };

    fields.push(
        { name: "input", title: _('Input'), type: "number", width: 70 },
        { name: "balance", title: _('Balance'), type: "number", readOnly: true, width: 70 },
        { type: "control" }
    );

    // create table
    grid.jsGrid({
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
                return asyncReceive("data/products.json", function (result) {
                    console.log('Products have been received');
                    var products = $.parseJSON(result);
                    products.forEach(function(item) {
                            item.sales.forEach(function(sale) {
                                var i = getDaysBetween(sale.date);
                                if (sale.count > 0) {
                                    item['d' + i] = sale.count;
                                }
                            });
                            console.log(item);
                            item.store = store;
                            grid.jsGrid("insertItem", item);
                    });
                }, {
                    'from': getDateInThePast(datePeriod).getTime()-1,
                    'to': getCurrentDate().getTime()+1,
                    'store': store
                });
            }
        },

        fields: fields,
        onItemDeleted: function(args) {
            console.log("onItemDeleted");
            asyncReceive("data/removeProduct.json", function () {}, args.item);
        },
        onItemUpdated: function(args) {
            console.log("onItemUpdated");
            asyncReceive("data/updateProduct.json", function () {
                for(i = 0; i < datePeriod; ++i) {
                    asyncReceive("data/updateSale.json", function () {
                        console.log("sale updated");
                    }, {
                        'product': args.item.id,
                        'store': store,
                        'date': getDateInThePast(i).getTime(),
                        'count': args.item['d' + i]
                    });
                    asyncReceive("data/updateInput.json", function () {
                        console.log("sale updated");
                    }, {
                        'product': args.item.id,
                        'store': store,
                        'date': getCurrentDate().getTime(),
                        'count': -args.item['input']
                    });
                }
            }, args.item);
        },
        onItemUpdating: function(args) {
            if (isNaN(args.item['balance'])) {
                args.item['balance'] = 0;
            }
            if (isNaN(args.item['input'])) {
                args.item['input'] = 0;
            }
            if (isNaN(args.previousItem['input'])) {
                args.previousItem['input'] = 0;
            }
            for(i = 0; i < datePeriod; ++i) {
                if (isNaN(parseInt(args.previousItem['d' + i]))) {
                    args.previousItem['d' + i] = 0;
                }
                if (isNaN(parseInt(args.item['d' + i]))) {
                    args.item['d' + i] = 0;
                }
                args.item['balance'] += args.previousItem['d' + i] - args.item['d' + i];
            }
            args.item['balance'] -= args.previousItem['input'] - args.item['input'];
        }
    });

    dialog = $("#detailsDialog").dialog({
        autoOpen: false,
        width: 400,
        height: 350,
        modal: true,
        buttons: {
            "Create": {
                text: _("Create"),
                click: function() {
                    item = {
                        name: $("#new-product-name").val(),
                        code: $("#new-product-code").val(),
                        store: store
                    };

                    console.log("Try to create new product...");
                    console.log(item);

                    asyncReceive("data/addNewProduct.json", function (result) {
                        console.log('Product have been added')
                        var product = $.parseJSON(result);
                        grid.jsGrid("insertItem", product);
                        dialog.dialog( "close" );
                    }
                    , item);
                }
            },
            "Cancel": {
                text: _("Cancel"),
                click: function() {
                    dialog.dialog( "close" );
                }
            }
        },
        close: function() {
            $("#detailsForm").validate().resetForm();
            $("#detailsForm").find(".error").removeClass("error");
        }
    });

    $( "#add-new-product" ).button().on( "click", function() {
        dialog.dialog( "open" );
        //grid.jsGrid("option", "inserting", true);
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
        var grid = $("#jsSalesGrid");

        var storesEl = $("#storesEl");
        var datePeriodEl = $('#period');
        storesEl.empty();
        stores.forEach(function(store) {
            storesEl.append('<option value="' + store.id + '">' + store.name + '</option>');
        });
        storesEl.selectmenu({
            change: function( event, data ) {
                console.log("load store");
                loadStore(grid, data.item.value, datePeriodEl.val());
            }
        });

        datePeriodEl.selectmenu({
            change: function( event, data ) {
                console.log("load period");
                loadStore(grid, storesEl.val(), data.item.value);
            }
        });

        asyncReceive("data/lang/text-ru.json", function (result) {
            $("[data-localize]").localize("text", { language: "ru", pathPrefix: "data/lang"});
            _.setTranslation($.parseJSON(result));
            loadStore(grid, stores[0].id, datePeriodEl.val());
        });
    });
});
