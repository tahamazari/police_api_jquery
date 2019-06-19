var all_forces
var ids_of_forces = []
var officers_details_object = []
var new_data_object = []

$(function(){
    if('all_forces' in localStorage){
        var local_all_forces = JSON.parse(localStorage.getItem('all_forces'))
        render_ul(local_all_forces)
    }
    else {
        $.ajax({
            type: 'GET',
            url: 'https://data.police.uk/api/forces',
            success: function(data){
                all_forces = data
                localStorage.setItem('all_forces', JSON.stringify((data)))
                render_ul(all_forces)
            }
        })
    }
})

function render_ul(data){
    $.each(
        data,
        function(i, list){
            ids_of_forces.push(data[i]['id'])
        }
    )

    $('#forces_name_table').append(
        '<thead><tr><th>Name</th><th>Id</th></tr></thead>' + 
        '<tbody></tbody>'
    )
    $.each(data, function(id, list){
        $('#forces_name_table tbody').append(
            '<tr><td>' + list['name'] + '</td> <td>' + list['id'] + '</td></tr>'
        )
    })
    $(document).ready( function () {
        $('#forces_name_table').DataTable();
    } );

    get_officers(ids_of_forces)
}

function get_officers(list){
    if("officers_details_object" in localStorage){
        var local_officers_details_object = JSON.parse(localStorage.getItem('officers_details_object'))
        var local_new_data_object = JSON.parse(localStorage.getItem('new_data_object'))
        make_force_officer_list_local(local_new_data_object)
    }
    else {
        $.each(list, function(i, id){
            setTimeout(function() {
                $.ajax({
                    type: 'GET',
                    url: 'https://data.police.uk/api/forces/' + id + '/people',
                    success: function(data){
                        if(data.length !== 0){
                            officers_details_object.push(data)
                            new_data_object.push({force: list[i], officers_data: data})
                            localStorage.setItem('officers_details_object', JSON.stringify((officers_details_object))) 
                            localStorage.setItem('new_data_object', JSON.stringify((new_data_object)))    
                            make_force_officer_list({_id: i, force: id, officers_data: data})
                        }
                    }
                })
            }, 2000);
        })
    }
}

function make_force_officer_list(list_data) {
    add_headers(list_data['force'])
    add_officer_data(list_data['officers_data'], list_data['force'])
}

function make_force_officer_list_local(list_data){
    $.each(list_data, function(id, list){        
        add_headers(list['force'])
        add_officer_data(list['officers_data'], list['force'])    
    })
}

function add_headers(list_data){
    $('<div class="row"><div class="col-md-2"></div>' + 
        '<div class="col-md-8"><ul id='+list_data+'>' 
        + '<h4 class="city_headings">' + list_data + 
        '</h4>' + '</ul>' +
        '</div></div>'
        ).appendTo('body')
    $('#' + list_data).append(
        '<table class="table table-striped" id="' + list_data + '0">' +
        '<thead class="thead-dark"><tr><th>Name</th><th>Rank</th></tr></thead>' + 
        '<tbody></tbody>' +
        '</table>'
    )
}

function add_officer_data(list_data, id){
    $.each(list_data, function(id_, list){
        $('#'+ id + '0 tbody').append(
            '<tr><td>' + list['name'] + '</td> <td>' + list['rank'] + '</td></tr>'
        )
        $(document).ready( function () {
            $('#' + id + '0').DataTable();
        } );
    })
}
