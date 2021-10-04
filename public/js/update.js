var order = {};
const renderOrder = async (id) => {
    const response = await fetch('http://localhost:3001/getOrder/' + id).then((resp) => resp.json());
    const existingOrder = response.order;
    const { zirconia, implant, mlsClassic, mlsPremium, tray, byte } = existingOrder;
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
    $("#hrs").val(order.hrs);
    $("#min").val(order.min);
    $("#ampm").val(order.ampm);
    $("#uleftI").val(order.upperLeft.value);
    $("#urightI").val(order.upperRight.value);
    $("#bleftI").val(order.bottomLeft.value);
    $("#bRightI").val(order.bottomRight.value);
    order.upperLeft.value.split("").forEach((i) => {

        $("#upperLeft").children()[8 - parseInt(i)].setAttribute('class', 'uleftActive');
    });
    order.upperRight.value.split("").forEach((i) => {
        $("#upperRight").children()[parseInt(i) - 1].setAttribute('class', 'urightActive');
    });
    order.bottomRight.value.split("").forEach((i) => {
        $("#bottomRight").children()[parseInt(i) - 1].setAttribute('class', 'brightActive');
    });
    order.bottomLeft.value.split("").forEach((i) => {
        $("#bottomLeft").children()[8 - parseInt(i)].setAttribute('class', 'bleftActive');
    });
    $("#updateOrderForm").attr("style", "opacity : 1");
    $("#loading").attr('style', "display : none")
    // $("#left").children()[8 - order.left.value].setAttribute('class', 'leftActive');
    // $("#top").children()[8 - order.top.value].setAttribute('class', 'topActive');
    // $("#bottom").children()[order.bottom.value-1].setAttribute('class', 'bottomActive');
    // $("#right").children()[order.right.value-1].setAttribute('class', 'rightActive');


}
$("#updateOrderForm").submit((e) => {
    e.preventDefault();
    $("#updateOrderForm").attr("style", "opacity : 0.5");
    $("#loading").attr('style', "display : block");
    
    const formData = e.currentTarget.elements;
    for (let i in order) {
        if (typeof order[i] !== "object" && i !== 'completed' && i !== "_id" && i!== 'files' && i!== 'lastModified' && i!== 'orderId') {
            if (formData[i].type === "checkbox") {
                order[i] = formData[i].checked;
            } else {
                order[i] = formData[i].value;
            }
        }
    }
    fillUpZirAndImplant(formData);
    if (order.upperLeft.value === "" || order.upperRight.value === "" || order.bottomLeft.value === "" || order.bottomRight.value === "") {
        swal("Please select upperLeft, upperRight, bottomLeft and bottomRight");
        return;
      }
    console.log(order); 
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
                $("#updateOrderForm").attr("style", "opacity : 1");
                $("#loading").attr('style', "display : none");
                swal({
                    text: response.message,
                    type: "success"
                }).then(() => {
                    location.href = "/dashboard"
                })
            }
        }
    });
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
        const reader = new FileReader();
        reader.onload = () => order.files.push(reader.result)
        for (let i = 0; i < e.target.files.length; i++) {
            reader.readAsDataURL(e.target.files[i]);
        }
    } else {
        swal("Images files only. Supported files are jpg, jpeg and png");
        e.preventDefault();
        e.target.value = '';
    }
});


$("#uleftB").click((e) => {
    order.upperLeft.value = '';
    $("#uleftI").val('');
    $('.uleftActive').removeClass('uleftActive')
});

$("#urightB").click((e) => {
    order.upperRight.value = '';
    $("#urightI").val('');
    $('.urightActive').removeClass('urightActive')
});

$("#bleftB").click((e) => {
    order.bottomLeft.value = '';
    $("#bleftI").val('');
    $('.bleftActive').removeClass('bleftActive')
});

$("#bRightB").click((e) => {
    order.bottomRight.value = '';
    $("#bRightI").val('');
    $('.brightActive').removeClass('brightActive')
});


$("#upperLeft").click((e)=>{
    if(order.upperLeft.value.length < 8 && e.target.nodeName === 'LI' && e.target.className !== 'uleftActive') {
      order.upperLeft.value += e.target.textContent;
      $("#uleftI").val(order.upperLeft.value);
      e.target.setAttribute('class', 'uleftActive');
    }
  });
  
  $("#upperRight").click((e)=>{
    if(order.upperRight.value.length < 8 && e.target.nodeName === 'LI' && e.target.className !== 'urightActive') {
      order.upperRight.value += e.target.textContent;
      $("#urightI").val(order.upperRight.value)
      e.target.setAttribute('class', 'urightActive');
    }
  });
  
  $("#bottomLeft").click((e)=>{
    if(order.bottomLeft.value.length < 8 && e.target.nodeName === 'LI' && e.target.className !== 'bleftActive') {
      order.bottomLeft.value += e.target.textContent;
      $("#bleftI").val(order.bottomLeft.value)
      e.target.setAttribute('class', 'bleftActive');
    }
  });
  
  $("#bottomRight").click((e)=>{
    if(order.bottomRight.value.length < 8 && e.target.nodeName === 'LI' && e.target.className !== 'brightActive') {
      order.bottomRight.value += e.target.textContent;
      $("#bRightI").val(order.bottomRight.value)
      e.target.setAttribute('class', 'brightActive');
    }
  });

