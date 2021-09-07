$("#loginForm").submit(function (e) {
  e.preventDefault();
  const formData = e.currentTarget.elements;
  const user = {
    username: formData.username.value,
    password: formData.password.value,
  };
  $.ajax({
    url: "/authenticate/user",
    contentType: "application/json",
    data: JSON.stringify({ user }),
    type: "POST",
    redirect: "follow",
    success: function (response) {
      if (response.error) swal(response.error);
      else { 
        try {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        location.href = response.url
        } catch (error) {
          swal("Something went wrong");
        }
      }
    },
  });
});
