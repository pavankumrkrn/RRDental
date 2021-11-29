
const selectedOrders = {};

const search = (e) => {
    let input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[3];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                let td2 = tr[i].getElementsByTagName("td")[5];
                if (td2) {
                    txtValue = td.textContent || td.innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                    } else {
                        let td3 = tr[i].getElementsByTagName("td")[6];
                        if (td3) {
                            txtValue = td3.textContent || td3.innerText;
                            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                                tr[i].style.display = "";
                            } else {
                                let td4 = tr[i].getElementsByTagName("td")[7];
                                if (td4) {
                                    txtValue = td4.textContent || td4.innerText;
                                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                                        tr[i].style.display = "";
                                    } else {
                                        tr[i].style.display = "none";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

const getCompleteOrders = async () => {
    $("#dashboard").attr("style", "opacity : 0.5");
    $("#loading").attr('style', "display : block");
    $("#incompleteOrders").attr('checked', false);
    $("#complete").attr('disabled', true);
    const response = await fetch("/completedOrders").then((resp) => resp.json());
    const { orders } = response;
    render(orders);
    $("#dashboard").attr("style", "opacity : 1");
    $("#loading").attr('style', "display : none");
}

const sendOrder = async () => {
    $("#dashboard").attr("style", "opacity : 0.5");
    $("#loading").attr('style', "display : block");
    let orders = Object.keys(selectedOrders).filter((i) => selectedOrders[i]);
    if (!orders.length) {
        swal("Please select atleast one order to send");
    } else {
        const response = await fetch("/sendOrders", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orders
            })
        }).then((resp) => resp.json()).catch((error) => error.response);
        $("#dashboard").attr("style", "opacity : 1");
        $("#loading").attr('style', "display : none");
        swal(response.message).then(()=>{
            window.location.reload();
        });
    }
}

const getIncompleteOrders = async () => {
    $("#dashboard").attr("style", "opacity : 0.5");
    $("#loading").attr('style', "display : block");
    $("#completedOrders").attr('checked', false);
    $("#complete").attr('disabled', false);
    const response = await fetch("/incompleteOrders").then((resp) => resp.json());
    const { orders } = response;
    render(orders);
    $("#dashboard").attr("style", "opacity : 1");
    $("#loading").attr('style', "display : none");
}

const getId = async (str) => {
    const id = str.split("??")[0];
    get(id)
}

const render = (orders) => {
    var html = '';
    var mls = {
        mlsClassic: false,
        mlsPremium: false
    };
    var enclosedWithCase = {
        tray: false,
        byte: false
    };

    orders.forEach((order, index) => {
        let files = ''
        order.files.forEach((file, fileIndex) =>
            files += '<img src="' + file + '" class="img-circle">' +
            '</img>');
        html += '<tr>' +
            '<td scope="row"><input id="' + order._id + '" type="checkbox" class="orders"' +
            'onchange="toggleOrder(this.id)">' +
            '</td>' +
            '<td>' + index + 1 + '</td>' +
            '<td>' +
            order._id +
            '</td>' +
            '<td>' +
            order.doctorName +
            '</td>' +
            '<td>' +
            order.date +
            '</td>' +
            '<td>' +
            order.clinicName +
            '</td>' +
            '<td>' +
            order.patientName +
            '</td>' +
            '<td>' +
            order.contactNumber +
            '</td>' +
            '<td>' +
            order.expectedDate +
            '</td>' +
            '<td>' +
            +order.hrs + " : " + order.min + " " + order.ampm +
            '</td>' +
            '<td>' +
            Object.keys(order.zirconia).filter((i) => order.zirconia[i]).join(', ') +
            '</td>' +
            '<td>' +
            order.zirconiaInfo +
            '</td>' +
            '<td>' +
            Object.keys(order.implant).filter((i) => order.implant[i]).join(', ') +
            '</td>' +
            '<td>' +
            order.implantInfo +
            '</td>' +
            '<td>' + Object.keys(mls).filter(i => order[i]).join(', ') + '</td>' +
            '<td>' +
            "Upper Left: " + order.upperLeft.value + " Upper Right: " + order.upperRight.value + " Bottom Left: " + order.bottomLeft.value + " Bottom Right: " + order.bottomRight.value +
            '</td>' +
            '<td>' +
            order.mlsInfo +
            '</td>' +
            '<td>' +
            order.enclose +
            '</td>' +
            '<td>' +
            order.shade +
            '</td>' +
            '<td>' + Object.keys(enclosedWithCase).filter(i => order[i]).join(', ') + '</td>' +
            // '<td>' + order.enclose + '</td>' +
            '<td id="' + order._id + "??" + '" onClick="getId(this.id)">' + files
        '</td>' +
            '</tr>'
    });

    $("#ordersL").html(html);

}



function getAll(id) {
    if ($("#" + id + ":checked").val()) {
        location.href = "/dashboard"
    }
}

const logout = async () => {
    $("#dashboard").attr("style", "opacity : 0.5");
    $("#loading").attr('style', "display : block");
    await fetch("/logout")
    location.href = "/";
}

$("#images").on('click', (e) => {
    // const htmlString = ''
    // $("#carouselImages").html(htmlString)
    // console.log("HI");
    // $('#myModal').modal('show');
})

$(document).ready(function () {
    let url = location.href.split("/");
    let route = url[url.length - 1]
    $("#" + route).prop("checked", true);
    if (route === "completedOrders") {
        $("#complete").prop("disabled", true);
    }
});

let images = []

const get = async (id) => {
    const response = await fetch('/getOrder/' + id).then((resp) => resp.json());
    const { files } = response.order;
    images = files;
    let htmlString = '';
    files.forEach((i, index) => {
        if (index === 0) {
            htmlString += '<div class="item active">' +
                '<img src="' + i + '" alt="Los Angeles">' +
                '</div>'

        } else {
            htmlString += '<div class="item">' +
                '<img src="' + i + '" alt="Los Angeles">' +
                '</div>'
        }
    })
    $("#carouselImages").html(htmlString)
    $('#myModal').modal('show');
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
                        response.error ? swal(response.error) : swal(response.message).then(() => {
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