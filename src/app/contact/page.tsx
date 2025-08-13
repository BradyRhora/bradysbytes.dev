"use client"
import { useState } from "react";

import PageHeader from "../components/items/pageHeader";
import { Card } from "../components/items/cards";

import style from "../styles/semiComponents.module.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetch("/api/Contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Thanks for the message! I'll get back to you ASAP.");
        setForm({ name: "", email: "", message: "" });
      }
      else alert("Message failed. Please try again later!");
    })
    
  }

  return (
    <>
    <PageHeader title="CONTACT"/>
    <Card className={style.contactCard}>            
        <form onSubmit={handleSubmit}>
        <label>
            Name:
            <input name="name" value={form.name} onChange={handleChange} required autoComplete="name" style={{ width: "100%"}} />
        </label>
        <label>
            Email:
            <input name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" style={{ width: "100%" }}/>
        </label>
        <label>
            Message:
            <textarea name="message" value={form.message} onChange={handleChange} required style={{ height: "200px", width: "100%" }}/>
        </label>
        <button style={{height:"30px",lineHeight:"0px"}} type="submit">Send</button>
        </form>
    </Card>
    </>
  );
}