function productsReceive(result) {
    console.log('Products have been received')
    var json = $.parseJSON(result);
    json.forEach(function(item) {

        asyncReceive("data/salesGroupedByDate.json", function(result) {
            var sales = $.parseJSON(result);
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
    $("#jsGrid").jsGrid({
        width: "100%",
        height: "400px",

        filtering: true,
        editing: true,
        sorting: true,
        paging: true,

        data: [],

        fields: [
            { name: "code", type: "text", width: 150 },
            { name: "count", type: "number", width: 50 },
            { name: "Address", type: "text", width: 200 },
            { name: "Country", type: "select", items: [], valueField: "Id", textField: "Name" },
            { name: "Married", type: "checkbox", title: "Is Married", sorting: false },
            { type: "control" }
        ]
    });

    asyncReceive("data/data.json", productsReceive)
});
