
const swiper = new Swiper('.swiper', {
  slidesPerView: 1,
  spaceBetween: 0,
  // init: false,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    640: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    856: {
      slidesPerView: 2,
      spaceBetween: 0,
    },
    1152: {
      slidesPerView: 3,
      spaceBetween: 0,
    },
    1556: {
      slidesPerView: 4,
      spaceBetween: 0,
    },
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

});

  // Swal.fire({
  //   title: 'Apa Anda Yakin?',
  //   text: "Jika terdapat kesalahan, anda tetap dapat mengeditnya!",
  //   icon: 'warning',
  //   showCancelButton: true,  
  //   confirmButtonColor: '#3085d6',
  //   cancelButtonColor: '#d33',
  //   confirmButtonText: 'Ya, Posting!'
  // }).then((result) => {
  //   if (result.isConfirmed) {
  //     Swal.fire(
  //       'Berhasil!',
  //       'Barang telah diunggah!.',
  //       'success'
  //     )
  //   }
  // })