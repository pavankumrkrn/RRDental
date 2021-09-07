const selectedOrders = {};

function getCompleteOrders(id) {
    if ($("#" + id + ":checked").val()) {
        location.href = "/completedOrders"
    }
}

function getIncompleteOrders(id) {
    if ($("#" + id + ":checked").val()) {
        location.href = "/incompleteOrders"
    }
}

function getAll(id) {
    if ($("#" + id + ":checked").val()) {
        location.href = "/dashboard"
    }
}

function logout() {
    localStorage.clear();
    location.href = "/";
}

function completeOrders() {
    let orders = Object.keys(selectedOrders).filter((i) => selectedOrders[i]);
    if (!orders.length) {
        swal("Please select atleast one order");
        return;
    }
    swal({
        title: "Are you sure",
        text: "Do you want to complete these orders",
        icon: "warning",
        dangerMode: true,
    }).then((isConfirm) => {
        if (isConfirm) {
            console.log(orders);
            $.ajax({
                url: "/completeOrder",
                contentType: "application/json",
                data: JSON.stringify({ orders }),
                type: "POST",
                success: function (response) {
                    if (response.error) {
                        swal(response.error).then(function () {
                            location.href = "/dashboard";
                        });;
                    } else {
                        swal(response.message).then(function () {
                            location.href = "/dashboard";
                        });;
                    }
                }
            })
        }
    });
}

function toggleOrder(id) {
    if ($("#" + id + ":checked").val()) {
        selectedOrders[id] = true
    } else {
        selectedOrders[id] = false
    }
    console.log(selectedOrders)
}

function deleteOrders() {
    let orders = Object.keys(selectedOrders).filter((i) => selectedOrders[i]);
    if (!orders.length) {
        swal("Please select atleast one order");
        return;
    } else {
        swal({
            title: "Are you sure",
            text: "Do you want to delete these orders",
            icon: "warning",
            dangerMode: true,
        }).then((isConfirm) => {
            if (isConfirm) {
                $.ajax({
                    url: "/deleteOrders",
                    contentType: "application/json",
                    data: JSON.stringify({ orders }),
                    type: "DELETE",
                    success: function (response) { 
                        response.error ? swal(response.error) : swal(response.message).then(()=>{
                            location.href = "/dashboard";
                        });
                       
                    }
                })
            }
        })
    }
}

function editOrder() {
    let Orders = Object.keys(selectedOrders).filter((i) => selectedOrders[i]);
    if (!Orders.length) {
        swal("Please select a single order to edit");
        return;
    }

    if (Orders.length > 1) {
        swal("Please select only single order to edit");
    } else {
        location.href = '/orderUpdate:' + Orders.join('');
    }
}