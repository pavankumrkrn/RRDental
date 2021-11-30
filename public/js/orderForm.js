const order = {
  orderId : "",
  doctorName: "",
  date: "",
  clinicName: "",
  patientName: "",
  contactNumber: "",
  expectedDate: "",
  hrs: "",
  min: "",
  ampm: "",
  zirconia: {
    zirconiaClassic: false,
    zirconiaPremium: false,
    zirconiaPlatinum: false,
    zirconiaMonolithic: false,
    zirconiaHollywood: false,
    zirconiaEmax: false,
    zirconiaTitanium: false,
    zirconiaPeek: false,
  },
  zirconiaInfo: "",
  implant: {
    implantClassic: false,
    implantPremium: false,
    implantPlatinum: false,
    implantMonolithic: false,
    implantHollywood: false,
    implantEmax: false,
    implantTitanium: false,
    implantPeek: false,
  },
  implantInfo: "",
  mlsClassic: false,
  mlsPremium: false,
  mlsInfo: "",
  enclose: "",
  shade: "",
  tray: false,
  byte: false,
  upperLeft: {
    name: "Upper Left",
    value: "",
  },
  upperRight: {
    name: "Upper Right",
    value: "",
  },
  bottomLeft: {
    name: "Bottom Left",
    value: "",
  },
  bottomRight: {
    name: "Bottom Right",
    value: ""
  },
  files : []
};


$(document).ready(()=>{
  for(let i=1; i<=12; i++){
    $('#hrs')
          .append($('<option>', { value : i })
          .text(i));
  }
  let digit
  for(let i=0; i<=59; i++){
    if(i.toString().length === 1){
      digit = "0"+i
    } else {
      digit = i
    }
    $('#min')
          .append($('<option>', { value : digit })
          .text(digit))
  }
});



$("#contactNumber").on('input', (e) => {
  let { value } = e.target;
  if(value.length === 1) {
    if(parseInt(value) < 6) {
      $("#contactNumber").val('');
    }
  }
  if(value.length >= 10) {
    $("#contactNumber").val(value.substr(0,10));
  }
})


$("#createOrderForm").submit(async (e) => {
  e.preventDefault();
    $("#createOrderForm").attr("style", "opacity : 0.5");
    $("#loading").attr('style', "display : block");
  const formData = e.currentTarget.elements;
  const data = await fetch('/incrementOrder')
  .then((resp) => resp.json()).then((data) => data).catch((error) => error.reponse);
  if(data.value) {
    order.orderId = data.value
  }
  for (let i in order) {
    if (typeof order[i] !== "object" && i !== "completed" && i!== "files" && i!=='orderId') {
      if (formData[i].type === "checkbox") {
        order[i] = formData[i].checked;
      } else {
        order[i] = formData[i].value;
      }
    }
  }
  fillUpZirAndImplant(formData);
  order['completed'] = false;
  console.log(order);
  if (order.upperLeft.value === "" || order.upperRight.value === "" || order.bottomLeft.value === "" || order.bottomRight.value === "") {
    swal("Please select upperLeft, upperRight, bottomLeft and bottomRight");
    $("#createOrderForm").attr("style", "opacity : 1");
    $("#loading").attr('style', "display : none");
    return;
  }

  $.ajax({
    url: "/createOrder",
    contentType: "application/json",
    data: JSON.stringify({order}),
    type: "POST",
    success: (response) => {
      if (response.error) {
        swal(response.error).then(() => {
          window.location.reload();
        });
      }
      else {
        $("#createOrderForm").attr("style", "opacity : 1");
        $("#loading").attr('style', "display : none");
        swal({
          text: response.message,
          type: "success"
        }).then(() => {
          window.location.reload();
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

$("#imageUpload").change(async (e)=>{
  const value = e.target.value;
  const extension = value.split(".")[1]
  if(extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
    for(let i=0; i<e.target.files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => order.files.push(reader.result)
      reader.readAsDataURL(e.target.files[i]);
    }
  } else {
    swal("Images files only. Supported files are jpg, jpeg and png");
    e.preventDefault();
    e.target.value = '';
  }
});

$("#uleftB").click((e)=>{
  order.upperLeft.value = '';
  $("#uleftI").val('');
  $('.uleftActive').removeClass('uleftActive')
});

$("#urightB").click((e)=>{
  order.upperRight.value = '';
  $("#urightI").val('');
  $('.urightActive').removeClass('urightActive')
});

$("#bleftB").click((e)=>{
  order.bottomLeft.value = '';
  $("#bleftI").val('');
  $('.bleftActive').removeClass('bleftActive')
});

$("#bRightB").click((e)=>{
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
