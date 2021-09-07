const order = {
  doctorName: "",
  date: "",
  clinicName: "",
  patientName: "",
  contactNumber: "",
  expectedDate: "",
  time: "",
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
  additionalInfo: "",
  enclose: "",
  shade: "",
  tray: false,
  byte: false,
  imageUpload: "",
  left: {
    name: "left",
    value: "",
  },
  right: {
    name: "right",
    value: "",
  },
  top: {
    name: "top",
    value: "",
  },
  bottom: {
    name: "bottom",
    value: ""
  }
};

$("#createOrderForm").submit(function (e) {
  e.preventDefault();
  const formData = e.currentTarget.elements;
  console.log(formData);
  for (let i in order) {
    if (typeof order[i] !== "object" && i !== "completed") {
      if (formData[i].type === "checkbox") {
        order[i] = formData[i].checked;
      } else {
        order[i] = formData[i].value;
      }
    }
  }
  fillUpZirAndImplant(formData);
  order['completed'] = false;
  if (order.left.value === "" || order.right.value === "" || order.top.value === "" || order.bottom.value === "") {
    swal("Please select left, right, top and bottom");
    return;
  }
  $.ajax({
    url: "/createOrder",
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
        }).then(function () {
          location.href = response.url;
        });
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

$("#imageUpload").change((e)=>{
  const value = e.target.value;
  const extension = value.split(".")[1]
  if(extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
    const file = e.target.files[0];
    const reader =  new FileReader();
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


$("#left").click((e)=>{
  order.left.value = e.target.textContent;
  if (document.querySelector('.leftActive')) {
      document.querySelector('.leftActive').classList.remove('leftActive');
  }
  e.target.setAttribute('class', 'leftActive');
});

$("#right").click((e)=>{
  order.right.value = e.target.textContent;
  if (document.querySelector('.rightActive')) {
      document.querySelector('.rightActive').classList.remove('rightActive');
  }
  e.target.setAttribute('class', 'rightActive');
});

$("#top").click((e)=>{
  order.top.value = e.target.textContent;
  if (document.querySelector('.topActive')) {
      document.querySelector('.topActive').classList.remove('topActive');
  }
  e.target.setAttribute('class', 'topActive');
});

$("#bottom").click((e)=>{
  order.bottom.value = e.target.textContent;
  if (document.querySelector('.bottomActive')) {
      document.querySelector('.bottomActive').classList.remove('bottomActive');
  }
  e.target.setAttribute('class', 'bottomActive');
});
