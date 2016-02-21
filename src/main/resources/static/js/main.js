        $(document).ready(function () {
                $.ajax({
                    url: "data/columns.json",
                    cache: false,
                    dataType: "text",
                    contentType:"application/json",
                    error: function (result) {
                        console.log('Receiving columns list failed')
                    },
                    success: function (result) {
                        console.log('Columns list has been gotten')
                        var json = $.parseJSON(result);

                        $("#jqGrid").jqGrid({
                            colModel: json,
                            viewrecords: true, // show the current page, data rang and total records on the toolbar
                            width: $(document).width(),
                            height: $(document).height(),
                            rowNum: 15,
                            datatype: 'local',
                            pager: "#jqGridPager",
                            caption: "Load live data from stackoverflow"
                        });

                        fetchGridData();

                    }
                });


            function fetchGridData() {

                var gridArrayData = [];
				// show loading message
				$("#jqGrid")[0].grid.beginReq();
                $.ajax({
                    url: "data/data.json",
                    cache: false,
                    dataType: "text",
                    contentType:"application/json",
                    success: function (result) {
                        console.log('Data has been received')
                        var json = $.parseJSON(result);
                        json.forEach(function(item) {
                            gridArrayData.push({
                                code: item.code,
                                count: item.count,
                                monday: item.monday,
                                tuesday: item.tuesday,
                                balance: item.balance
                            });
                        })
						// set the new data
						$("#jqGrid").jqGrid('setGridParam', { data: gridArrayData});
						// hide the show message
						$("#jqGrid")[0].grid.endReq();
						// refresh the grid
						$("#jqGrid").trigger('reloadGrid');
                    }
                });
            }

            function formatTitle(cellValue, options, rowObject) {
                return cellValue.substring(0, 50) + "...";
            };

            function formatLink(cellValue, options, rowObject) {
                return "<a href='" + cellValue + "'>" + cellValue.substring(0, 25) + "..." + "</a>";
            };

        });
