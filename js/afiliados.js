var url_path
if (window.location.href.includes("http://127.0.0.1:5500")) {
  url_path = "http://localhost:46104/forms/"
} else {
  url_path = "/forms/"
}

$(document).ready(function () {

  $(".file").fileinput({
    language: 'es',
    showRemove: false,
    showUpload: false,
  });

  console.log("document ready")

  axios.get(url_path + "provincias").then(res => {
    res.data.map(prov => {
      $('#provincia').append($('<option>', {
        value: prov.id,
        text: prov.nombre
      }));
      $('#empleador_provincia').append($('<option>', {
        value: prov.id,
        text: prov.nombre
      }));
    })
  })
  //console.log(res.data)


})

//console.log(url_path)

$("#btn_submit").on("click", () => {

  if (validar()) {



    if (!$("#chk_confirma").prop("checked")) {
      alert("Por favor confirmá que comprendés que para mantener la condición de afiliado AGC debo abonar en tiempo y forma la cuota sindical equivalente al 3% de mi salario bruto.")
      return false
    }
    let formData = new FormData();

    $('.form-control,.custom-select').each(function (i, obj) {
      console.log("name", obj.name, "id", obj.id)

      formData.append(obj.name, obj.value)
    });
    formData.append("empleador_tipo_domicilio", $("input:radio[name ='empleador_tipo_domicilio']:checked").val())


    const img_dni_frente = document.querySelector('#doc_dni_frente');
    if (img_dni_frente.files.length < 1) {
      alert("Seleccione un archivo de imagen para DNI frente")
      return

    }
    if ((img_dni_frente.files[0].size / 1024 / 1024) > 5) {
      alert("El archivo para DNI frente debe pesar menos de 5mb")
      return
    }
    formData.append("img_dni_frente", img_dni_frente.files[0]);

    const img_dni_dorso = document.querySelector('#doc_dni_dorso');
    if (img_dni_dorso.files.length < 1) {
      alert("Seleccione un archivo de imagen para DNI dorso")
      return
    }

    if ((img_dni_dorso.files[0].size / 1024 / 1024) > 5) {
      alert("El archivo para DNI dorso debe pesar menos de 5mb")
      return
    }
    formData.append("img_dni_dorso", img_dni_dorso.files[0]);

    const img_recibo = document.querySelector('#doc_recibo');
    if (img_recibo.files.length < 1) {
      alert("Seleccione un archivo de imagen para recibo de sueldo")
      return
    }

    if ((img_recibo.files[0].size / 1024 / 1024) > 5) {
      alert("El archivo para recibo de sueldo debe pesar menos de 5mb")
      return
    }
    formData.append("img_recibo", img_recibo.files[0]);


    //console.log(url_path)

    axios.post(url_path + "afiliados", formData)

      .then(res => {
        console.log(res)
        window.location = "afiliados_paso2.html"

      })
      .catch(error => {
        console.log("el error", error)
        if (error.response.status == 400)
          alert(error.response.data)
        if (error.response.status == 500)
          alert("Error interno")

      })


  }

})


function validar() {
  let res = true
  $(".form-control,.custom-select").each(function (d) {

    var field = $(this)
    var required = field.attr("required")
    if (required) {
      let elem = field[0]
      if (elem.type == "select-one") {
        if (elem.selectedIndex == 0) {
          let lbl = $("label[for='" + elem.id + "']")

          alert("Seleccione algún valor en la lista " + lbl.html())
          elem.focus()
          res = false
          return false


        }
      }
      if (!elem.checkValidity()) {

        let lbl = $("label[for='" + elem.name + "']")
        alert("Campo '" + lbl.html() + "' contiene datos inválidos")
        elem.focus()
        res = false
        return false
      }

    }
  })

  return res
}