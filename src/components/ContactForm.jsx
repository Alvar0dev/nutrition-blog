import { useState } from 'react';

const INITIAL_STATE = {
  name: '',
  email: '',
  message: '',
};

export default function ContactForm() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (errorMessage) {
      setErrorMessage('');
    }
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
    };

    if (!trimmed.name || !trimmed.email || !trimmed.message) {
      setErrorMessage('Por favor, completa todos los campos con texto válido antes de enviar.');
      return;
    }

    setErrorMessage('');
    setStatus('submitting');
    setSubmittedData(trimmed);
    setStatus('success');
    setFormData(INITIAL_STATE);
  };

  const handleReset = () => {
    setSubmittedData(null);
    setErrorMessage('');
    setStatus('idle');
  };

  if (status === 'success' && submittedData) {
    const whatsappText = encodeURIComponent(
      `Hola Álvaro, soy ${submittedData.name} (${submittedData.email}).\n\n${submittedData.message}`
    );
    const mailtoSubject = encodeURIComponent(`Consulta web de ${submittedData.name}`);
    const mailtoBody = encodeURIComponent(
      `Nombre: ${submittedData.name}\nEmail: ${submittedData.email}\n\nMensaje:\n${submittedData.message}`
    );

    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-accent/5 border border-silver/30 rounded-xl p-6 text-accent space-y-5 font-body"
      >
        <div className="space-y-2">
          <h3 className="font-display text-2xl text-silver">¡MENSAJE PREPARADO!</h3>
          <p className="text-sm text-gray-300">
            Gracias, <strong className="text-accent">{submittedData.name}</strong>. Elige cómo prefieres
            enviar tu consulta directa a Álvaro Aguilar:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={`https://wa.me/34655397061?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-primary text-accent py-3 px-4 rounded-lg font-display text-center hover:bg-opacity-90 transition-colors"
          >
            ENVIAR POR WHATSAPP
          </a>
          <a
            href={`mailto:info@nutricionalcoach.com?subject=${mailtoSubject}&body=${mailtoBody}`}
            className="inline-flex items-center justify-center bg-accent text-secondary py-3 px-4 rounded-lg font-display text-center hover:bg-silver transition-colors"
          >
            ENVIAR POR EMAIL
          </a>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="w-full text-sm text-silver hover:text-accent underline transition-colors pt-2"
        >
          Escribir otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-silver mb-2 font-body">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tu nombre completo"
          className="w-full px-4 py-2.5 rounded-lg bg-accent text-secondary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-silver mb-2 font-body">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          className="w-full px-4 py-2.5 rounded-lg bg-accent text-secondary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-silver mb-2 font-body">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          rows="4"
          value={formData.message}
          onChange={handleChange}
          placeholder="Cuéntame tus objetivos o dudas..."
          className="w-full px-4 py-2.5 rounded-lg bg-accent text-secondary placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        ></textarea>
      </div>
      {errorMessage && (
        <p
          role="alert"
          className="text-sm font-body text-accent bg-primary/40 border border-primary rounded-lg px-4 py-2.5"
        >
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-primary text-accent py-3 rounded-lg font-display hover:bg-opacity-90 transition-colors disabled:opacity-50"
      >
        {status === 'submitting' ? 'PROCESANDO...' : 'ENVIAR MENSAJE'}
      </button>
    </form>
  );
}
