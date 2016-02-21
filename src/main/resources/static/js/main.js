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

                { name: "store", type: "select", items: stores, valueField: "Id", textField: "Name" },
                { name: "Married", type: "checkbox", title: "Is Married", sorting: false },
                { type: "control" }
            ]
        });

        asyncReceive("data/data.json", productsReceive)
    });
});
