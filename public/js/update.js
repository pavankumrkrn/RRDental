var order = {};
const renderOrder = async (id) => {
    const response = await fetch('http://localhost:3001/getOrder/' + id).then((resp) => resp.json());
    const existingOrder = response.order;
    const { zirconia, implant, mlsClassic, mlsPremium, tray, byte} = existingOrder;
    order = existingOrder
    Object.keys(zirconia).forEach((i) => {
        $("#" + i).prop("checked", zirconia[i]);
    })
    Object.keys(implant).forEach((i) => {
        $("#" + i).prop("checked", implant[i]);
    })
    $("#mlsClassic").prop("checked", mlsClassic);
    $("#mlsPremium").prop("checked", mlsPremium);
    $("#tray").prop("checked", tray);
    $("#byte").prop("checked", byte);
    $("#left").children()[8 - order.left.value].setAttribute('class', 'leftActive');
    $("#top").children()[8 - order.top.value].setAttribute('class', 'topActive');
    $("#bottom").children()[order.bottom.value-1].setAttribute('class', 'bottomActive');
    $("#right").children()[order.right.value-1].setAttribute('class', 'rightActive');

}
$("#updateOrderForm").submit((e) => {
    e.preventDefault();
    const formData = e.currentTarget.elements;
    for (let i in order) {
        if (typeof order[i] !== "object" && i !== 'completed' && i!== "_id") {
            if (formData[i].type === "checkbox") {
                order[i] = formData[i].checked;
            } else {
                order[i] = formData[i].value;
            }
        }
    }
    fillUpZirAndImplant(formData);
    if (order.left.value === "" || order.right.value === "" || order.top.value === "" || order.bottom.value === "") {
        swal("Please select left, right, top and bottom");
        return;
    }
    $.ajax({
        url: "/updateOrder/" + $("#orderId").val(),
        contentType: "application/json",
        data: JSON.stringify({ order }),
        type: "POST",
        success: function (response) {
            if (response.error) {
                swal(response.error)
            }
            else {
                swal({
                    text: response.message,
                    type: "success"
                })
            }
        }
    })
});

const fillUpZirAndImplant = (formData) => {
    for (let i in order.zirconia) {
        order.zirconia[i] = formData[i].checked;
    }
    for (let i in order.implant) {
        order.implant[i] = formData[i].checked;
    }
};
$("#imageUpload").change((e) => {
    const value = e.target.value;
    const extension = value.split(".")[1]
    if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            var dataURL = reader.result;
            order.imageUpload = dataURL
        }
        reader.readAsDataURL(file)
    } else {
        swal("Images files only. Supported files are jpg, jpeg and png");
        e.preventDefault();
        e.target.value = '';
    }
});


$("#left").click((e) => {
    order.left.value = e.target.textContent;
    if (document.querySelector('.leftActive')) {
        document.querySelector('.leftActive').classList.remove('leftActive');
    }
    e.target.setAttribute('class', 'leftActive');
});

$("#right").click((e) => {
    order.right.value = e.target.textContent;
    if (document.querySelector('.rightActive')) {
        document.querySelector('.rightActive').classList.remove('rightActive');
    }
    e.target.setAttribute('class', 'rightActive');
});

$("#top").click((e) => {
    order.top.value = e.target.textContent;
    if (document.querySelector('.topActive')) {
        document.querySelector('.topActive').classList.remove('topActive');
    }
    e.target.setAttribute('class', 'topActive');
});

$("#bottom").click((e) => {
    order.bottom.value = e.target.textContent;
    if (document.querySelector('.bottomActive')) {
        document.querySelector('.bottomActive').classList.remove('bottomActive');
    }
    e.target.setAttribute('class', 'bottomActive');
});

