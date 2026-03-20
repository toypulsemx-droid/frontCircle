import React, { useEffect, useState } from "react";
import { reviews } from "../../../Utils/referencias";
import "../Styles/referencias.css";
import { TiStar } from "react-icons/ti";
import { sortReviewsByDateDesc } from "../../../Utils/funtionsApp";

export const Referencias = () => {
  const [formView, setFormView] = useState(false);
  const [comentario, setComentario] = useState(false);

  const review = sortReviewsByDateDesc(reviews);

  useEffect(() => {
    setFormView(false);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    comment: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    title: false,
    comment: false,
  });

  const validarEmail = (valor) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(valor);
  };

  const validarText = (valor) => valor.trim().length > 1;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const estadoNombre = !touched.name
    ? ""
    : formData.name.trim() === ""
      ? "invalid"
      : validarText(formData.name)
        ? "valid"
        : "invalid";

  const estadoEmail = !touched.email
    ? ""
    : formData.email === ""
      ? "invalid" // 👈 AQUÍ el cambio clave
      : validarEmail(formData.email)
        ? "valid"
        : "invalid";

  const estadoTitle = !touched.title
    ? ""
    : formData.title.trim() === ""
      ? "invalid"
      : validarText(formData.title)
        ? "valid"
        : "invalid";

  const estadoComentario = !touched.comment
    ? ""
    : formData.comment.trim() === ""
      ? "invalid"
      : validarText(formData.comment)
        ? "valid"
        : "invalid";

  const MAX_CHARS = 200;

  const formularioValido =
    validarEmail(formData.email) &&
    validarText(formData.comment) &&
    validarText(formData.name) &&
    validarText(formData.title);

  const handleSend = async () => {
    if (!formularioValido) {
      alert("Llena todos los campos");
      return;
    }
    setComentario(true);
    await new Promise((r) => setTimeout(r, 5000));
    setComentario(false);
     setFormView(false)
    setForm(false);
   
  };

  return (
    <>
    
      <div className="container_referencias">
        {
        comentario ? (
            <div className="tank_comment">
                <span> “¡Gracias por tomarte el tiempo de escribir tu comentario! Valoramos mucho tu opinión.”</span>
            </div>
        ):
        null
    }
        <h3 className="title_ref">Nuestras Reseñas</h3>
        <div className="referencias_form">
          <div className="btn_form_ref">
            <button onClick={() => setFormView(true)}>
              Deja tu comentario
            </button>
          </div>
          
          <div className={`form_view ${formView ? "active" : ""}`}>
            <div className="group_1_inputs_ref">
              <div className="input_name_form">
                <label>Nombre*</label>
                <div className="input_stylye_ref">
                  <input
                    type="text"
                    className={`input_form_refencia ${estadoNombre}`}
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={formData.name}
                  />{" "}
                  {estadoNombre === "invalid" &&
                    formData.name.trim() === "" && (
                      <>
                        <span className="text_invalid">
                          Este campo es obligatorio.
                        </span>
                      </>
                    )}{" "}
                </div>
              </div>
              <div className="input_email_form">
                <label>E-mail*</label>
                <div className="input_stylye_ref">
                  <input
                    type="email"
                    className={`input_form_refencia ${estadoEmail}`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {estadoEmail === "invalid" &&
                    formData.email.trim() === "" && (
                      <>
                        <span className="text_invalid">
                          Introduzca un correo electrónico válido, por favor.
                        </span>
                      </>
                    )}
                </div>
              </div>
            </div>
            <div className="input_title_ref">
              <label>Titulo*</label>
              <div className="input_stylye_ref">
                <input
                  type="text"
                  className={`input_form_refencia ${estadoTitle}`}
                  name="title"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={formData.title}
                />
              </div>
            </div>
            <div className="input_comment_ref">
              <label>Comentario*</label>
              <div className="input_stylye_ref">
                <input
                  type="text"
                  className={`input_form_refencia ${estadoComentario}`}
                  name="comment"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_CHARS) {
                      handleChange(e);
                    }
                  }}
                  value={formData.comment}
                  maxLength={MAX_CHARS}
                />
                <span className="char_counter">
                  {formData.comment.length}/{MAX_CHARS}
                </span>
                {estadoComentario === "invalid" &&
                  formData.comment.trim() === "" && (
                    <>
                      <span className="text_invalid">
                        Este campo es obligatorio.
                      </span>
                    </>
                  )}
              </div>
            </div>
            <div className="bnt_form_view">
              <button className="send_comment" onClick={handleSend}>Deja tu comentario</button>
              <button
                className="close_form_red"
                onClick={() => setFormView(false)}
              >
                Cerra
              </button>
            </div>
          </div>
        </div>
        <div className="box_referencias">
          {review.map((ref, i) => (
            <div className="referencia_content" key={i}>
              <div className="block_1_referencias">
                <h5>
                  <strong>{ref.name} </strong> | {ref.date}
                </h5>
                <div className="ref_star">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={star <= ref.rating ? "star active" : "star"}
                    >
                      <TiStar />
                    </span>
                  ))}
                </div>
              </div>
              <div className="block_2_referncias">
                <span>{ref.title}</span>
              </div>
              <div className="block_3_referencias">
                <div className="contenedor_referencias">
                  <p>{ref.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
