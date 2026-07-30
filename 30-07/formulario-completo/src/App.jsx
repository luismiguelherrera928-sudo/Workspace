import { useEffect, useState } from 'react'
import './App.css'

const initialForm = {
  name: '',
  email: '',
  password: '',
  age: '',
  birthDate: '',
  experience: 5,
  terms: false,
  languages: [],
  modality: 'presencial',
  country: '',
  comments: '',
  color: '#4f46e5',
}

function App() {
  const [formData, setFormData] = useState(initialForm)
  const [submittedData, setSubmittedData] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const emailValid = /\S+@\S+\.\S+/.test(formData.email)
  const ageValid = Number(formData.age) > 0
  const canSubmit = formData.terms && emailValid && ageValid

  useEffect(() => {
    if (!photoFile) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl('')
      return
    }

    const nextUrl = URL.createObjectURL(photoFile)
    setPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }
      return nextUrl
    })

    return () => URL.revokeObjectURL(nextUrl)
  }, [photoFile])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleLanguageChange = (event) => {
    const { value, checked } = event.target

    setFormData((current) => ({
      ...current,
      languages: checked
        ? [...current.languages, value]
        : current.languages.filter((language) => language !== value),
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    setSubmittedData({
      ...formData,
      photoName: photoFile?.name || 'Sin foto',
    })
  }

  return (
    <div className="app-shell">
      <h1>Registro de estudiante</h1>
      <p className="intro">
        Completa todos los campos para registrar tu perfil con una experiencia completa.
      </p>

      <form className="student-form" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Tu nombre"
          />
        </label>

        <label>
          Correo electrónico
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
        </label>
        {!emailValid && formData.email && (
          <p className="error">Ingresa un correo con formato válido.</p>
        )}

        <label>
          Contraseña
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Crea una contraseña"
          />
        </label>

        <label>
          Edad
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="1"
            placeholder="18"
          />
        </label>
        {formData.age && !ageValid && (
          <p className="error">La edad debe ser mayor a 0.</p>
        )}

        <label>
          Fecha de nacimiento
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
          />
        </label>

        <label className="range-field">
          <span>Nivel de experiencia: {formData.experience}</span>
          <input
            type="range"
            name="experience"
            min="1"
            max="10"
            value={formData.experience}
            onChange={handleChange}
          />
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
          />
          Acepto los términos y condiciones
        </label>

        <fieldset>
          <legend>Lenguajes que conoces</legend>
          <div className="checkbox-group">
            {['JavaScript', 'Python', 'Java', 'C#', 'Go'].map((language) => (
              <label key={language}>
                <input
                  type="checkbox"
                  value={language}
                  checked={formData.languages.includes(language)}
                  onChange={handleLanguageChange}
                />
                {language}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Modalidad</legend>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="modality"
                value="presencial"
                checked={formData.modality === 'presencial'}
                onChange={handleChange}
              />
              Presencial
            </label>
            <label>
              <input
                type="radio"
                name="modality"
                value="virtual"
                checked={formData.modality === 'virtual'}
                onChange={handleChange}
              />
              Virtual
            </label>
          </div>
        </fieldset>

        <label>
          País
          <select name="country" value={formData.country} onChange={handleChange}>
            <option value="">Selecciona un país</option>
            <option value="Argentina">Argentina</option>
            <option value="Colombia">Colombia</option>
            <option value="México">México</option>
            <option value="España">España</option>
            <option value="Estados Unidos">Estados Unidos</option>
          </select>
        </label>

        <label>
          Comentarios
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            rows="4"
            placeholder="Cuéntanos algo sobre ti"
          />
        </label>

        <label>
          Foto de perfil
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setPhotoFile(event.target.files?.[0] || null)}
          />
        </label>

        {previewUrl && (
          <img className="preview-image" src={previewUrl} alt="Vista previa de la foto" />
        )}

        <label>
          Color favorito
          <input type="color" name="color" value={formData.color} onChange={handleChange} />
        </label>

        <button type="submit" disabled={!canSubmit}>
          Enviar
        </button>
      </form>

      {submittedData && (
        <section className="summary">
          <h2>Resumen del registro</h2>
          <ul>
            <li><strong>Nombre:</strong> {submittedData.name}</li>
            <li><strong>Correo:</strong> {submittedData.email}</li>
            <li><strong>Edad:</strong> {submittedData.age}</li>
            <li><strong>Fecha de nacimiento:</strong> {submittedData.birthDate}</li>
            <li><strong>Experiencia:</strong> {submittedData.experience}/10</li>
            <li><strong>País:</strong> {submittedData.country}</li>
            <li><strong>Modalidad:</strong> {submittedData.modality}</li>
            <li><strong>Lenguajes:</strong> {submittedData.languages.join(', ') || 'Ninguno'}</li>
            <li><strong>Comentarios:</strong> {submittedData.comments || 'Sin comentarios'}</li>
            <li><strong>Foto:</strong> {submittedData.photoName}</li>
            <li><strong>Color favorito:</strong> {submittedData.color}</li>
          </ul>
        </section>
      )}
    </div>
  )
}

export default App
