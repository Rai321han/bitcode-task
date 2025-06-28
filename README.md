<!-- TABLE OF CONTENTS -->
<details id="readme-top">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#techs">Tech Stacks</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#usage">Usage</a></li>
      </ul>
    </li>
    <li><a href="#security">Security Highlights</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>

  </ol>
</details>

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://vercel.com/)
[![Live Demo](https://img.shields.io/badge/demo-live-blue)](https://bitcode-task.vercel.app/)

<!-- ABOUT THE PROJECT -->

## About The Project

[![Select Component][product-screenshot]](https://bitcode-task.vercel.app/)

A collaborative platform where users can explore predefined roadmaps and engage through **upvoting** and **commenting** — turning feedback into impact.

## 🚀 Live Demo

🔗 [Try it now](https://bitcode-task.vercel.app/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Features

### ✅ Authentication

- Secure login/signup using email & password
- JWT-based auth with **access/refresh tokens**
- Tokens stored in **HttpOnly cookies** for security

### 📋 Roadmap Display

- Roadmap items fetched from the database (read-only)
- Filter by status
- Sort by popularity

### 📣 Upvoting

- Express interest in roadmap items with a single upvote
- Users can upvote once per roadmap

### 💬 Commenting System

- Comment on any roadmap item
- Reply in nested threads
- Edit/Delete your own comments
- Optimistic UI for instant feedback
- Visual indentation for replies

### 🧠 Feedback-Focused UI

- Intuitive, clean interface
- Real-time-ready architecture (WebSocket support planned)

---

### Tech Stacks

Major frameworks/libraries used to built this site:

| Layer      | Tech                                     |
| ---------- | ---------------------------------------- |
| Frontend   | Next.js 14, Tailwind CSS, React Query    |
| Backend    | Express.js, MongoDB, Mongoose            |
| Auth       | JWT (access & refresh), HttpOnly Cookies |
| Deployment | Vercel (frontend), Render (backend)      |
| Email      | Nodemailer (for verification)            |

- [![React.js]][React-url]
- [![Tailwind]][Tailwind-url]
- [![Gemini]][Gemini-url]
- [![Firebase]][Firebase-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy of the project and to start running the application, you can follow the instructions below.

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/Rai321han/bitcode-task.git
   cd bitcode-task
   ```

2. Setup Environment Variables

Create .env.local for frontend

```sh
    NEXT_PUBLIC_BASE_API_URL=http://localhost:5100
```

Create .env for backend

```sh
PORT=<backend server port number>
MONGODB_URI=<mongodb URI>
ACCESS_SECRET=<secret for signing access token>
REFRESH_SECRET=<secret for signing refresh token>
EMAIL_USER=<your email for sending verification email to user>
EMAIL_PASS=<your google app password>
GOOGLE_REFRESH_TOKEN=<your google refresh token>
GOOGLE_CLIENT_SECRET=<your google client secret>
GOOGLE_CLIENT_ID=<your google client ID>
FRONTEND_URL=<your frontend url>
```

2. Install Dependencies

   ```sh
   npm install
   ```

3. Run the project

   # Backend

   ```sh
   npm run dev
   ```

   # Frontend

   ```sh
   npm run dev
   ```

4. Folder structure
   .
   ├── app
   │ ├── components/
   │ ├── hooks/
   │ ├── libs/
   │ ├── providers/
   │ └── (auth, roadmaps)
   ├── pages/api/
   ├── server/
   │ ├── routes/
   │ ├── controllers/
   │ └── middleware/
   └── public/

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# 🔐 Security Highlights

- Access Token expires quickly (e.g., 2 mins)
- Refresh Token stored securely in HttpOnly cookies
- Refresh Token Rotation to prevent token replay attacks


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

[![Linkedin]][Linkedin-url] [![Twitter]][Twitter-url] [![Gmail]][Gmail-url]

[Project Link](https://github.com/Rai321han/AI-Trip-Planner)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[product-screenshot]: ./public/aitripbanner.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Tailwind]: https://img.shields.io/badge/Tailwind-CSS?style=for-the-badge&logo=tailwindcss&logoColor=%2306B6D4&color=%23222222
[Tailwind-url]: https://tailwindcss.com/
[TypeScript]: https://img.shields.io/badge/TypeScript-BLUE?style=for-the-badge&logo=typescript&logoColor=%233178C6&color=%23222222
[TypeScript-url]: https://www.typescriptlang.org/
[Linkedin]: https://img.shields.io/badge/-LinkedIn-blue.svg?style=for-the-badge&logo=linkedin&colorB=555
[Linkedin-url]: https://www.linkedin.com/in/raihan-uddin-6681411b2
[Twitter]: https://img.shields.io/badge/Twitter-black?style=for-the-badge&logo=x&logoColor=white
[Twitter-url]: https://x.com/RaihanU46038448
[Gmail]: https://img.shields.io/badge/Gmail-red?style=for-the-badge&logo=gmail&logoColor=white
[Gmail-url]: mailto:uddinraihan797@gmail.com
[Firebase]: https://img.shields.io/badge/Firebase-orange?style=for-the-badge&logo=firebase&logoColor=orange&labelColor=black&color=black
[Gemini]: https://img.shields.io/badge/Gemini-white?style=for-the-badge&logo=googlegemini&color=black
[Gemini-url]: https://ai.google.dev/
[Firebase-url]: https://firebase.google.com

```

```
