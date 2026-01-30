# 📰 Del Interior - Plataforma de Noticias Digitales

> **Cliente:** Del Interior (Medio Digital)
> **Rol:** Full Stack Developer (Diseño, Arquitectura y Desarrollo)
> **Estado:** 🟢 En Producción

## 📖 Sobre el Proyecto

**Del Interior** es una plataforma de noticias moderna diseñada para ofrecer una experiencia de lectura fluida y veloz. El proyecto nació de la necesidad del cliente de migrar de un sistema legacy a una solución **SPA (Single Page Application)** que permitiera tiempos de carga instantáneos y una gestión de contenidos (CMS) simplificada para sus redactores.

Este repositorio contiene el código fuente del frontend y la lógica de integración con servicios serverless.

🔗 **Visitar Sitio Web:** [https://delinteriorapp.netlify.app/](https://delinteriorapp.netlify.app/)

## 🎯 El Desafío Técnico

El objetivo principal fue construir un sistema dual:
1.  **Portal Público:** Optimizado para SEO y performance (Core Web Vitals), capaz de manejar picos de tráfico.
2.  **Panel de Administración (CMS):** Una interfaz intuitiva y segura donde los periodistas pudieran redactar notas, subir imágenes y categorizar contenido sin conocimientos técnicos.

## 🛠 Stack Tecnológico

El proyecto fue construido sobre una arquitectura **Serverless** para reducir costos de mantenimiento y asegurar escalabilidad automática.

* **Frontend Core:** React.js + Vite (para una build optimizada y rápida).
* **Lenguaje:** JavaScript (ES6+).
* **Estilos & UI:** Tailwind CSS (Diseño responsive y sistema de diseño customizado).
* **Backend as a Service (BaaS):** Firebase Ecosystem.
    * **Authentication:** Gestión segura de sesiones para administradores.
    * **Firestore Database:** Base de datos NoSQL para almacenamiento de artículos y comentarios en tiempo real.
    * **Storage:** Optimización y alojamiento de assets multimedia.

## ✨ Funcionalidades Clave

### 🚀 Portal de Noticias (Frontend)
* **Renderizado Dinámico:** Carga de noticias por categorías (Política, Sociedad, Deportes) sin recargar la página.
* **Buscador Integrado:** Filtrado de contenido en tiempo real consultando índices de Firestore.
* **Responsive Design:** Interfaz "Mobile-First" adaptada a cualquier dispositivo.
* **Engagement:** Sistema de comentarios interactivo para lectores.

### 🔐 Back-Office (Panel de Admin)
* **Editor WYSIWYG:** Interfaz rica para redacción de artículos (negritas, citas, enlaces).
* **Gestión Multimedia:** Subida de imágenes con previsualización y almacenamiento automático en la nube.
* **CRUD Completo:** Control total (Crear, Leer, Actualizar, Borrar) sobre el contenido publicado.
* **Seguridad:** Rutas protegidas accesibles únicamente para usuarios autenticados y verificados.

## 💡 Decisiones de Arquitectura

* **¿Por qué React + Vite?**
    Se priorizó la velocidad de desarrollo y la experiencia de usuario (SPA). Vite permite tiempos de build extremadamente cortos comparado con Webpack.
* **¿Por qué Firebase?**
    Para un medio digital mediano, gestionar un servidor dedicado (Node/Express + MongoDB) implicaba costos fijos innecesarios. Firebase permite escalar a cero costos cuando el tráfico es bajo y escalar automáticamente durante noticias de última hora ("breaking news").
* **Optimización de Imágenes:**
    Se implementó una lógica de carga diferida (Lazy Loading) para mejorar el First Contentful Paint (FCP) en conexiones móviles lentas.

---

### 🛡 Nota de Seguridad

Este repositorio es una muestra del código fuente con fines de portafolio.
* Las **claves de API y credenciales de administración** han sido ocultadas mediante variables de entorno (`.env`).
* La lógica de negocio sensible está protegida por **Reglas de Seguridad de Firestore** en el lado del servidor.

---
© Desarrollado por [Nicolás Luján](https://www.linkedin.com/in/nicolujan1610/)
