"use client"
import { useState } from "react";

import PageHeader from "../components/items/pageHeader";
import { Card } from "../components/items/cards";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Replace this with API call 
    console.log("Form submitted:", form);
    alert("Thank you for your message!");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <>
    <PageHeader title="CONTACT"/>
    <h2 style={{textAlign: "center"}}>Not currently functional!</h2>
    <Card>            
        <form onSubmit={handleSubmit}>
        <label>
            Name:
            <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "100%"}}
            />
        </label>
        <label>
            Email:
            <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
            />
        </label>
        <label>
            Message:
            <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            style={{ width: "100%" }}
            />
        </label>
        <button type="submit">Send</button>
        </form>
    </Card>
    </>
  );
}