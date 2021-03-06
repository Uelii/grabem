function loadBuildingDataOnDocumentLoad() {

    $(document).ready(function() {
        var id = $("#object_ids").val();
        var url = '/immogate/public/getBuildingData';

        if(id != '') {
            $.ajax({
                url: url+'/'+id,
                type: 'GET',
                success: function(data)
                {
                    $('#street').val(data.building_street);
                    $('#street_number').val(data.building_street_number);
                    $('#zip_code').val(data.building_zip_code);
                    $('#city').val(data.building_city);
                }
            });
        }
    });
}

function loadBuildingDataOnDropdownSelectionChange() {
    $(document).ready(function() {
        $('#object_id').change(function() {
            var id = $("#object_id").val();
            var url = '/immogate/public/getBuildingData';

            if(id != ''){
                $.ajax({
                    url: url+'/'+id,
                    type: 'GET',
                    success: function(data)
                    {
                        $('#street').val(data.building_street);
                        $('#street_number').val(data.building_street_number);
                        $('#zip_code').val(data.building_zip_code);
                        $('#city').val(data.building_city);
                    }
                });
            } else {
                $('#street').val('');
                $('#street_number').val('');
                $('#zip_code').val('');
                $('#city').val('');
            }
        });
    });
}

function removeBuildingDataOnMainDomicileNo() {
    $(document).ready(function() {
        $('#is_main_domicile_no').click(function() {
            $('#street').val('');
            $('#street_number').val('');
            $('#zip_code').val('');
            $('#city').val('');
        });
    });
}

function loadBuildingDataOnMainDomicileYes() {
    $(document).ready(function() {
        $('#is_main_domicile_yes').click(function() {
            var id = $("#object_ids").val();
            var url = '/immogate/public/getBuildingData';

            $.ajax({
                url: url+'/'+id,
                type: 'GET',
                success: function(data)
                {
                    $('#street').val(data.building_street);
                    $('#street_number').val(data.building_street_number);
                    $('#zip_code').val(data.building_zip_code);
                    $('#city').val(data.building_city);
                }
            });
        });
    });
}

function getCityFromZipCode() {
    $(document).ready(function() {
        var zip_code_input_field = document.getElementById('zip_code');

        /*when the user clicks off of the zip field*/
        $(zip_code_input_field).keyup(function(){
            if($(this).val().length == 4){
                var zip_code_value  = $(this).val();
                var country = 'Schweiz';

                $('#zip_code').css({
                    'border': ''
                });

                /*make a request to the google geocode api*/
                $.ajax({
                   url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+zip_code_value+'+'+country+'&key=AIzaSyBjWUnjUDNYBIrUpLQa-ZMyX3_I_-H2wSw',
                    dataType: 'json',
                    success: function(response){
                        if(response.status != 'ZERO_RESULTS'){
                            /*find the city*/
                            var address_components = response.results[0].address_components;
                            $.each(address_components, function(index, component){
                                var types = component.types;
                                $.each(types, function(index, type){
                                    if(type == 'locality') {
                                        city = component.long_name;
                                    }
                                });
                            });
                        } else {
                            $('#city').val('');
                            $('#zip_code').css({
                                'border': '1px solid red'
                            });
                        }

                        /*pre-fill the city & check for multiple cities and turn city into a dropdown if necessary*/
                        var cities = response.results[0].postcode_localities;
                        if(cities) {
                            var select = document.createElement('select');
                            select.id = 'city';
                            select.className = 'form-control';
                            select.name = 'city';
                            select.required = 'true';

                            $.each(cities, function(index, locality){
                                var option = document.createElement('option');
                                option.value = locality;
                                option.innerHTML = locality;

                                if(city == locality) {
                                    option.selected = 'selected';
                                }
                                select.appendChild(option);
                            });
                            $('#city_wrap').html(select);

                        } else {
                            var input = document.createElement('input');
                            input.id = 'city';
                            input.type = 'text';
                            input.className = 'form-control';
                            input.name = 'city';
                            input.required = 'true';

                            $('#city_wrap').html(input);
                            $('#city').val(city);
                        }
                    }
                });
            } else {
                $('#city').val('');
                $('#zip_code').css({
                   'border': '1px solid red'
                });
            }
        });
    });
}

function addSortTableOptions(dataTableId) {
    $(document).ready(function(){
        var date = new Date();

        var month = date.getMonth()+1;
        var day = date.getDate();

        var currentDate = date.getFullYear() + '-' +
            (month<10 ? '0' : '') + month + '-' +
            (day<10 ? '0' : '') + day;

        if(dataTableId = 'buildings_data'){
            $("#buildings_data").DataTable({
                responsive: true,
                oLanguage: { "sSearch": '<i class="fa fa-search" aria-hidden="true"></i>'},
                "order": [[0, "asc"]]
            });
        }
        if(dataTableId = 'objects_data'){
            $("#objects_data").DataTable({
                responsive: true,
                oLanguage: { "sSearch": '<i class="fa fa-search" aria-hidden="true"></i>'},
                "order": [[0, "asc"], [1, "asc"]]
            });
        }
        if(dataTableId = 'renter_data_renter_view'){
            $("#renter_data_renter_view").DataTable({
                responsive: true,
                oLanguage: { "sSearch": '<i class="fa fa-search" aria-hidden="true"></i>'},
                "columnDefs": [
                    {
                        "targets": [ 11 ],
                        "visible": false,
                    },
                    {
                    "targets": '_all',
                    "createdCell": function (td, cellData, rowData, row, col) {
                        /*make cell red if contract end date has been reached*/
                        if((cellData < currentDate) && (cellData > rowData[8])){
                            $(td).css('background-color', 'red');
                        }
                    }
                },
                ],
                "order": [[11, "desc"], [1, "asc"], [2, "asc"]]
            });
        }
        if(dataTableId = 'renter_data_object_view'){
            $("#renter_data_object_view").DataTable({
                responsive: true,
                oLanguage: { "sSearch": '<i class="fa fa-search" aria-hidden="true"></i>'},
                "columnDefs": [
                    {
                        "targets": [ 7 ],
                        "visible": false,
                    },
                    {
                    "targets": '_all',
                    "createdCell": function (td, cellData, rowData, row, col) {
                        /*make cell red if contract end date has been reached*/
                        if((cellData < currentDate) && (cellData > rowData[4])){
                            $(td).css('background-color', 'red');
                        }
                    }
                }],
                "order": [[1, "asc"]]
            });
        }
        if(dataTableId = 'payments_data'){
            $("#payments_data").DataTable({
                responsive: true,
                oLanguage: { "sSearch": '<i class="fa fa-search" aria-hidden="true"></i>'},
                "order": [[4, "asc"], [5, "desc"]]
            });
        }
        if(dataTableId = 'payments_data_renter_view'){
            $("#payments_data_renter_view").DataTable({
                responsive: true,
                oLanguage: { "sSearch": '<i class="fa fa-search" aria-hidden="true"></i>'},
                "order": [[2, "asc"], [3, "desc"]]
            });
        }
        if(dataTableId = 'invoices_data'){
            $("#invoices_data").DataTable({
                responsive: true,
                oLanguage: { "sSearch": '<i class="fa fa-search" aria-hidden="true"></i>'},
                "columnDefs": [ {
                    "targets": '_all',
                    "createdCell": function (td, cellData, rowData, row, col) {
                        /*make cell red if contract end date has been reached and if the invoice has not been paid yet*/
                        if((cellData < currentDate) && (cellData > rowData[3]) && (rowData[5].indexOf("is_paid_no") >= 0)){
                            $(td).css('background-color', 'red');
                        }
                    }
                }],
                "order": [[5, "asc"], [3, "desc"]]
            });
        }
    });
}

function addPopoverOnIndexView() {
    $(document).ready(function(){
        $('[data-toggle="deletion_popover"]').popover();
    });
}

function addPopoverOnShowView() {
    $(document).ready(function(){
        $('[data-toggle="deletion_popover"]').popover();
    });
}

function loadBootstrapModal() {
    $(document).ready(function(){
        $(document).on('click', '#btnOpenModal', function(){
            var dataId = $(this).attr('data-id');
            $("#modalDelete_"+dataId).modal();
        });
    });
}

function loadDatepickerOnInputClick() {
    $(document).ready(function(){
        $("#beginning_of_contract").datepicker({
            dateFormat: "yy-mm-dd"
        });
        $("#end_of_contract").datepicker({
            dateFormat: "yy-mm-dd"
        });
        $("#invoice_date").datepicker({
            dateFormat: "yy-mm-dd"
        });
        $("#payable_until").datepicker({
            dateFormat: "yy-mm-dd"
        });
        $("#start_date").datepicker({
            dateFormat: "yy-mm-dd"
        });
        $("#end_date").datepicker({
            dateFormat: "yy-mm-dd"
        });

        $("#date").datepicker({
            dateFormat: "yy-mm-dd"
        });
    });
}

function changeAmountOnCheckboxClick(){
    $(document).ready(function(){
        $(document).on('change', '.is_paid_checkbox', function(){
            var dataId = $(this).data("id");
            var paymentId = dataId[0];
            var amountTotal = dataId[1];
            var amountPaid = dataId[2];
            var new_boolean = 1;

            $('#amountPaid_'+dataId).html(number_format(amountTotal, 2, '.', '\'') + ' Fr.');

            var url = '/immogate/public/changePaymentBooleanIsPaid';
            var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');

            $.ajax({
                /*url: url+'/'+paymentId,*/
                url: 'changePaymentBooleanIsPaid',
                type: 'POST',
                data:
                {
                    '_token': CSRF_TOKEN,
                    'paymentId': paymentId,
                    'amountTotal': amountTotal,
                    'amountPaid': amountPaid,
                },
                success: function(data){
                    $('#isPaid_'+paymentId).html("<p class=is_paid_yes><i class='fa fa-check' aria-hidden=true></i> PAID</p>");
                }
            });
        });
    });
}

function changeIsPaidOnCheckboxClick(){
    $(document).ready(function() {
        $(document).on('change', '.is_paid_checkbox', function () {
            var dataId = $(this).data("id");
            var invoiceId = dataId[0];

            var url = '/immogate/public/changeInvoiceBooleanIsPaid';
            var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');

            $.ajax({
                url: 'changeInvoiceBooleanIsPaid',
                type: 'POST',
                data:
                {
                    '_token': CSRF_TOKEN,
                    'invoiceId': invoiceId
                },
                success: function(data){
                    $('#isPaid_'+invoiceId).html("<p class=is_paid_yes><i class='fa fa-check' aria-hidden=true></i> PAID</p>");
                }
            });
        });
    });
}

function changeObjectOnBuildingChange(){
    $(document).ready(function() {
        $('#building_id').change(function () {
            var selected_building_id = $(this).val()

            if ( $('#object_id').children().length > 0 ) {
                $('#object_id').empty();
            }

            var url = '/immogate/public/getObjectData';
            var select = document.getElementById('object_id');

            if(selected_building_id != ''){
                $.ajax({
                    url: url+'/'+selected_building_id,
                    type: 'GET',
                    success: function(response)
                    {
                        $.each(response, function(index, val){
                            var option = document.createElement('option');
                            option.value = val.id;
                            option.innerHTML = val.name + ': ' + val.living_space + ' sqm, ' + val.number_of_rooms + '-room, ' + val.floor_room_number;

                            select.appendChild(option);
                        });
                    }
                });
            }
        });
    });
}

/*From: http://locutus.io/php/strings/number_format/*/
function number_format (number, decimals, dec_point, thousands_sep) {
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

function changeRenterOnBuildingChange(){
    $(document).ready(function() {
        $('#building_id').change(function () {
            var selected_building_id = $(this).val()

            if ( $('#renter_id').children().length > 0 ) {
                $('#renter_id').empty();
            }

            var url = '/immogate/public/getRenterData';
            var select = document.getElementById('renter_id');

            if(selected_building_id != ''){
                $.ajax({
                    url: url+'/'+selected_building_id,
                    type: 'GET',
                    success: function(response)
                    {
                        $.each(response, function(index, val){
                            var option = document.createElement('option');
                            option.value = val.id;
                            option.innerHTML = val.last_name + ', ' + val.first_name + ': ' + val.street + ' ' + val.street_number + ', ' + val.zip_code + ' ' + val.city;

                            select.appendChild(option);
                        });
                    }
                });
            }
        });
    });
}

function filterRenterOnIndexView(){
    $(document).ready(function() {
        $.fn.dataTableExt.afnFiltering.push(function(oSettings, aData, iDataIndex) {

            if(aData[11] == 1){
                return true;
            }

            var checked = $('#checkbox').is(':checked');

            if (checked && aData[11] == 0 || aData[11] == 1) {
                return true;
            }
            if (!checked && aData[11] == 1) {
                return true;
            }
            return false;
        });

        var oTable = $('#renter_data_renter_view').dataTable();

        oTable.fnDraw();

        $('#checkbox').on("click", function(e) {
            oTable.fnDraw();
        });
    });
}

function filterRenterOnObjectShowView(){
    $(document).ready(function() {
        $.fn.dataTableExt.afnFiltering.push(function(oSettings, aData, iDataIndex) {

            if(aData[7] == 1){
                return true;
            }

            var checked = $('#checkbox').is(':checked');

            if (checked && aData[7] == 0 || aData[7] == 1) {
                return true;
            }
            if (!checked && aData[7] == 1) {
                return true;
            }
            return false;
        });

        var oTable = $('#renter_data_object_view').dataTable();

        oTable.fnDraw();

        $('#checkbox').on("click", function(e) {
            oTable.fnDraw();
        });
    });
}
