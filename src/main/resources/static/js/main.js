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

function loadProducts(grid, store, filter) {
    console.log("filter.type=" + filter.type);
    return asyncReceive("data/sales.json", function (result) {
        console.log('Products have been received');
        var products = $.parseJSON(result);
        products.forEach(function(item) {
            item.sales.forEach(function(sale) {
                var i = getDaysBetween(sale.date);
                if (sale.count > 0 && filter.type == "sales") {
                    item['d' + i] = sale.count;
                }
                if (sale.count < 0 && filter.type == "inputs") {
                    item['d' + i] = -sale.count;
                }
            });
            console.log(item);
            item.store = store;
            grid.jsGrid("insertItem", item);
        });
    }, {
        'from': getDateInThePast($('#period').val()).getTime()-1,
        'to': getCurrentDate().getTime()+1,
        'store': store
    });
}

function loadStore(grid, store, datePeriod, type) {
    console.log("Current store " + type);
    console.log(store);

    // create fields in the table
    var fields = [
        { name: "code", title: _('Code'), type: "text", width: 100 },
        { name: "name", title: _('name'), type: "text", width: 100 },
    ];

    for(i = datePeriod - 1; i >= 0 ; --i) {
        var d = getDateInThePast(i)
        fields.push({ name: "d" + i, title: d.toLocaleDateString('ru-RU'), type: "number", width: 70 });
    };

    fields.push(
        { name: "balance", title: _('Balance'), type: "number", readOnly: true, width: 70 },
        { type: "control" }
    );

    // create table
    grid.jsGrid({
        width: "100%",
        height: window.innerHeight - 80,

        filtering: true,
        editing: true,
        sorting: true,
        paging: true,
        autoload: true,

        data: [],
        controller: {
            loadData: function(filter) {
                filter.type = type;
                return loadProducts(grid, store, filter);
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
                    var count = parseInt(args.item['d' + i]);
                    if (count == 0) {
                        continue;
                    }
                    asyncReceive(type == "inputs" ? "data/updateInput.json" : "data/updateSale.json", function () {
                        console.log("sales updated");
                    }, {
                        'product': args.item.id,
                        'store': store,
                        'date': getDateInThePast(i).getTime(),
                        'count': count
                    });
                }
            }, args.item);
        },
        onItemUpdating: function(args) {
            if (isNaN(args.item['balance'])) {
                args.item['balance'] = 0;
            }
            for(i = 0; i < datePeriod; ++i) {
                if (isNaN(parseInt(args.previousItem['d' + i]))) {
                    args.previousItem['d' + i] = 0;
                }
                if (isNaN(parseInt(args.item['d' + i]))) {
                    args.item['d' + i] = 0;
                }
                if (type == "inputs") {
                    args.item['balance'] -= args.previousItem['d' + i] - args.item['d' + i];
            } else {
                    args.item['balance'] += args.previousItem['d' + i] - args.item['d' + i];
                }
            }
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
                    }, item);
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
}

$(document).ready(function () {
    var datePeriodEl = $('#period');
    var salesTypeEl = $('#salesType');
    var grid = $("#jsSalesGrid");
    var storesEl = $("#storesEl");

    var onParamChanged = function ( event, data ) {
        console.log("load...");
        loadStore(grid, storesEl.val(), datePeriodEl.val(), salesTypeEl.val());
    }

    asyncReceive("data/stores.json", function (result) {
        console.log('Stores have been received')
        var stores = $.parseJSON(result);

        storesEl.empty();
        stores.forEach(function(store) {
            storesEl.append('<option value="' + store.id + '">' + store.name + '</option>');
        });
        storesEl.selectmenu({change: onParamChanged});

        asyncReceive("data/lang/text-ru.json", function (result) {
            $("[data-localize]").localize("text", { language: "ru", pathPrefix: "data/lang"});
            _.setTranslation($.parseJSON(result));

            datePeriodEl.empty();
            datePeriodEl.append('<option value="' + 7 + '">' + _("week") + '</option>');
            datePeriodEl.append('<option value="' + 14 + '">' + _("2weeks") + '</option>');

            salesTypeEl.empty();
            salesTypeEl.append('<option value="' + 'sales' + '">' + _("sales") + '</option>');
            salesTypeEl.append('<option value="' + 'inputs' + '">' + _("inputs") + '</option>');

            datePeriodEl.selectmenu({change: onParamChanged});
            salesTypeEl.selectmenu({change: onParamChanged});

            loadStore(grid, storesEl.val(), datePeriodEl.val(), salesTypeEl.val());
        });
    });
});
