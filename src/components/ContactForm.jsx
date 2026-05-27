import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for future form submission logic
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-silver mb-2 font-body">
          Nombre
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-accent text-secondary"
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
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-accent text-secondary"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-silver mb-2 font-body">
          Mensaje
        </label>
        <textarea
          id="message"
          rows="4"
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-accent text-secondary"
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-accent py-3 rounded-lg font-display hover:bg-opacity-90 transition-colors"
      >
        ENVIAR MENSAJE
      </button>
    </form>
  );
}
