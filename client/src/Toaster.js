import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  heightAuto: false,
  onOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const makeToast = (type, msg) => {
  Toast.fire({
    icon: type,
    title: msg,
  });
// Swal.fire({
//     position: 'top-end',
//     heightAuto:false,
//     imageHeight:"100px",
//     icon: type,
//     title: msg,
//     showConfirmButton: false,
//     timer: 1500,
//     timerProgressBar:true

//   })
};

export default makeToast;