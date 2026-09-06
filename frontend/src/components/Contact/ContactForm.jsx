import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import {
  FiArrowUpRight,
  FiMail,
  FiSend,
  FiUser,
  FiXCircle,
} from "react-icons/fi";

const initialForm = {
  from_name: "",
  from_email: "",
  subject: "",
  message: "",
};

const ContactForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (status !== "idle") {
      setStatus("idle");
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    const name = formData.from_name.trim();
    const email = formData.from_email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name) {
      nextErrors.from_name = "Please enter your name.";
    } else if (name.length < 2) {
      nextErrors.from_name = "Name must contain at least 2 characters.";
    }

    if (!email) {
      nextErrors.from_email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.from_email = "Please enter a valid email address.";
    }

    if (!subject) {
      nextErrors.subject = "Please enter a subject.";
    } else if (subject.length < 3) {
      nextErrors.subject = "Subject must contain at least 3 characters.";
    }

    if (!message) {
      nextErrors.message = "Please enter your message.";
    } else if (message.length < 10) {
      nextErrors.message = "Message must contain at least 10 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setStatus("error");
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS environment variables are missing.");
      setStatus("error");
      return;
    }

    try {
      setStatus("sending");

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.from_name.trim(),
          from_email: formData.from_email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          reply_to: formData.from_email.trim(),
        },
        publicKey
      );

      setFormData(initialForm);
      setErrors({});
      setStatus("success");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("error");
    }
  };

  const renderError = (field) => {
    if (!errors[field]) return null;

    return (
      <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-red-400">
        <FiXCircle size={11} />
        {errors[field]}
      </p>
    );
  };

  const getInputClasses = (field, extra = "") => {
    return `w-full rounded-lg border bg-white/[0.025] text-xs text-white outline-none transition placeholder:text-white/15 ${
      errors[field]
        ? "border-red-500/30 focus:border-red-500/50"
        : "border-white/[0.08] focus:border-white/[0.18]"
    } ${extra}`;
  };

  return (
    <div className="contact-form-card flex w-full max-w-[500px] flex-col rounded-[24px] border border-white/[0.08] bg-[#0b0c0f]/75 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[8px] font-medium uppercase tracking-[0.22em] text-white/25">
            Message
          </p>

          <h2 className="mt-1.5 font-serif text-xl text-white">
            Tell us what you need
          </h2>

          <p className="mt-2 max-w-lg text-[11px] leading-5 text-white/30">
            Fill in the details below and our team will get back to you as
            soon as possible.
          </p>
        </div>

        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] sm:flex">
          <FiSend size={15} className="text-white/45" />
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-5 flex flex-1 flex-col"
        noValidate
      >
        {/* Name + Email */}
        <div className="grid gap-3.5 sm:grid-cols-2">
          {/* Name */}
          <div>
            <label
              htmlFor="from_name"
              className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.16em] text-white/30"
            >
              Your name
            </label>

            <div className="relative">
              <FiUser
                size={13}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
              />

              <input
                id="from_name"
                name="from_name"
                type="text"
                value={formData.from_name}
                onChange={handleChange}
                placeholder="John Doe"
                autoComplete="name"
                className={getInputClasses(
                  "from_name",
                  "h-10 pl-10 pr-3"
                )}
              />
            </div>

            {renderError("from_name")}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="from_email"
              className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.16em] text-white/30"
            >
              Email address
            </label>

            <div className="relative">
              <FiMail
                size={13}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20"
              />

              <input
                id="from_email"
                name="from_email"
                type="email"
                value={formData.from_email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className={getInputClasses(
                  "from_email",
                  "h-10 pl-10 pr-3"
                )}
              />
            </div>

            {renderError("from_email")}
          </div>
        </div>

        {/* Subject */}
        <div className="mt-3.5">
          <label
            htmlFor="subject"
            className="mb-1.5 block text-[9px] font-medium uppercase tracking-[0.16em] text-white/30"
          >
            Subject
          </label>

          <input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            placeholder="How can we help?"
            className={getInputClasses("subject", "h-10 px-3")}
          />

          {renderError("subject")}
        </div>

        {/* Message */}
        <div className="mt-3.5">
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="message"
              className="block text-[9px] font-medium uppercase tracking-[0.16em] text-white/30"
            >
              Message
            </label>

            <span className="text-[8px] text-white/20">
              {formData.message.length}/1000
            </span>
          </div>

          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us a little about your question..."
            maxLength={1000}
            className={getInputClasses(
              "message",
              "h-[150px] resize-none px-3 py-3 leading-5"
            )}
          />

          {renderError("message")}
        </div>

        {/* General error */}
        {status === "error" && Object.keys(errors).length === 0 && (
          <div className="mt-3.5 flex items-start gap-2.5 rounded-lg border border-red-500/15 bg-red-500/[0.05] px-3 py-2.5">
            <FiXCircle
              size={13}
              className="mt-0.5 shrink-0 text-red-400/80"
            />

            <p className="text-[9px] leading-4 text-red-300/70">
              Something went wrong while sending your message. Please try
              again in a moment.
            </p>
          </div>
        )}

        {/* Submit */}
        <div className="mt-4">
          <button
            type="submit"
            disabled={status === "sending"}
            className="group relative flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-white px-4 text-[10px] font-medium text-black transition duration-300 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/[0.05] to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            {status === "sending" ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                Sending message...
              </>
            ) : (
              <>
                Send message

                <FiArrowUpRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;