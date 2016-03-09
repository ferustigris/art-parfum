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

function loadProducts(grid, store, filter, summaryGrid) {
    console.log("filter.type=" + filter.type);
    return asyncReceive("data/sales.json", function (result) {
        console.log('Products have been received');
        var products = $.parseJSON(result);
        products.forEach(function(item) {
            item.sales.forEach(function(sale) {
                var i = getDaysBetween(sale.date);
                var index = 'd' + i;
                if (isNaN(parseInt(summaryGrid.counts[index]))) {
                    summaryGrid.counts[index] = 0;
                }
                if (isNaN(parseInt(summaryGrid.prises[index]))) {
                    summaryGrid.prises[index] = 0;
                }
                if (sale.count > 0 && filter.type == "sales") {
                    item[index] = sale.count;
                    summaryGrid.counts[index] += sale.count;
                    summaryGrid.prises[index] += sale.count * $('#new-product-prise').val();
                }
                if (sale.count < 0 && filter.type == "inputs") {
                    item[index] = -sale.count;
                    summaryGrid.counts[index] -= sale.count;
                    summaryGrid.prises[index] -= sale.count * $('#new-product-start-prise').val();
                }
            });
            console.log(item);
            item.store = store;
            grid.jsGrid("insertItem", item);
            summaryGrid.jsGrid("refresh");
        });
    }, {
        'from': getDateInThePast($('#period').val()).getTime()-1,
        'to': getCurrentDate().getTime()+1,
        'store': store
    });
}

function createNewItem(grid, item) {
    console.log("Create new product...");
    console.log(item);

    asyncReceive("data/addNewProduct.json", function (result) {
        console.log('Product have been added')
        var product = $.parseJSON(result);
        grid.jsGrid("insertItem", product);
        dialog.dialog( "close" );
    }, item);
}

function updateProduct(item, datePeriod, store, requestPath) {
    for(i = 0; i < datePeriod; ++i) {
        var count = parseInt(item['d' + i]);
        if (count == 0) {
            continue;
        }
        asyncReceive(requestPath, function () {
            console.log("sales updated");
        }, {
            'product': item.id,
            'store': store,
            'date': getDateInThePast(i).getTime(),
            'count': count
        });
    }
}

function onUpdateProduct(item, previousItem, datePeriod, type, summaryGrid) {
    if (isNaN(item['balance'])) {
        item['balance'] = 0;
    }
    for(i = 0; i < datePeriod; ++i) {

        var index = 'd' + i;
        if (isNaN(parseInt(summaryGrid.counts[index]))) {
            summaryGrid.counts[index] = 0;
        }
        if (isNaN(parseInt(summaryGrid.prises[index]))) {
            summaryGrid.prises[index] = 0;
        }

        if (isNaN(parseInt(previousItem[index]))) {
            previousItem[index] = 0;
        }
        if (isNaN(parseInt(item[index]))) {
            item[index] = 0;
        }
        if (type == "inputs") {
            item['balance'] -= previousItem[index] - item[index];
            summaryGrid.prises[index] -= (previousItem[index] - item[index]) * $('#new-product-start-prise').val();
        } else {
            summaryGrid.prises[index] -= (previousItem[index] - item[index]) * $('#new-product-prise').val();
            item['balance'] += previousItem[index] - item[index];
        }

        summaryGrid.counts[index] -= previousItem[index] - item[index];
    }
    summaryGrid.jsGrid("refresh");
}

function createFieldsForGrid(datePeriod) {
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
        { name: "balance", title: _('Balance'), type: "number", readOnly: true },
        { type: "control" }
    );
    return fields;
}

function createSummaryGrid(summary, fields) {
    // create table
    var summaryCounts = {
        'code': _('count')
    };
    var summaryPrise = {
        'code': _('prise')
    };

    summary.jsGrid({
        width: "100%",

        filtering: false,
        editing: false,
        removing: false,
        sorting: false,
        paging: false,
        heading: false,
        selecting: false,
        autoload: true,
        data: [
            summaryCounts,
            summaryPrise
        ],

        fields: fields
    });
    summary.counts = summaryCounts;
    summary.prises = summaryPrise;
    return summary;
}

function createAddNewProductDialog(grid, store) {

    var dialog = $("#detailsDialog").dialog({
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
                        prise: $("#new-product-prise").val(),
                        store: store
                    };
                    createNewItem(grid, item);
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
    });

    return dialog;
}

function loadStore(grid, store, datePeriod, type) {
    console.log("Current store " + type);
    console.log(store);

    // create fields in the table
    var fields = createFieldsForGrid(datePeriod);

    var summary = createSummaryGrid($("#jsSummariesGrid"), fields);
    // create table
    grid.jsGrid({
        width: "100%",

        filtering: true,
        editing: true,
        sorting: true,
        paging: true,
        autoload: true,
        data: [],

        controller: {
            loadData: function(filter) {
                filter.type = type;
                return loadProducts(grid, store, filter, summary);
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
                requestPath = type == "inputs" ? "data/updateInput.json" : "data/updateSale.json";
                updateProduct(args.item, datePeriod, store, requestPath);
            }, args.item);
        },
        onItemUpdating: function(args) {
            console.log("onItemUpdating");
            onUpdateProduct(args.item, args.previousItem, datePeriod, type, summary);
        }
    });

    createAddNewProductDialog(grid, store);
}

$(document).ready(function () {
    var datePeriodEl = $('#period');
    var salesTypeEl = $('#salesType');
    var grid = $("#jsSalesGrid");
    var storesEl = $("#storesEl");

    var optionsDialog = $("#optionsDialog").dialog({
        autoOpen: false,
        width: 400,
        height: 350,
        modal: true,
        buttons: {
            "Save": {
                text: 'ok',
                click: function() {
                    optionsDialog.dialog( "close" );
                }
            },
            "Cancel": {
                text: _("Cancel"),
                click: function() {
                    $('#new-product-start-prise').val(0);
                    $('#new-product-prise').val(12);
                    optionsDialog.dialog( "close" );
                }
            }
        }
    });

    $('#options').button().on( "click", function() {
        optionsDialog.dialog("open");
    });

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
