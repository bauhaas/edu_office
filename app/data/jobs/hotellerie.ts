import type { JobPage } from '#shared/types/job'

export const hotellerie = {
  slug: 'hotellerie',
  title: 'Hôtellerie, Restauration & Tourisme',
  tagline: 'Et si ton métier c’était de rendre les gens heureux ?',
  sections: [
    {
      id: 'subjobs',
      type: 'subjobs',
      items: [
        {
          id: 'restauration',
          label: 'Restauration & Cuisine',
          cover: { src: '/images/cover-restauration.jpg', alt: 'Un chef dresse des assiettes en cuisine' },
          stickers: [
            { id: 'fork', asset: { src: '/images/sticker-fork.png', alt: '' }, x: 80, y: 32, width: 34, rotate: 18 },
            { id: 'oui-chef', asset: { src: '/images/sticker-oui-chef.png', alt: '' }, x: 34, y: 66, width: 46, rotate: -10 }
          ]
        },
        {
          id: 'gestion',
          label: 'Gestion Hôtelière',
          cover: { src: '/images/cover-gestion.jpg', alt: 'Une responsable marketing dans un grand hôtel' },
          stickers: [
            { id: 'key', asset: { src: '/images/sticker-key.png', alt: '' }, x: 80, y: 52, width: 40, rotate: -20 }
          ]
        },
        {
          id: 'tourisme',
          label: 'Tourisme & Expérience voyageur',
          cover: { src: '/images/cover-tourisme.jpg', alt: 'Une équipe d’agence de voyage à son bureau' },
          stickers: [
            { id: 'stamp', asset: { src: '/images/sticker-stamp.png', alt: '' }, x: 24, y: 36, width: 36, rotate: -12 },
            { id: 'boarding-pass', asset: { src: '/images/sticker-boarding-pass.png', alt: '' }, x: 76, y: 52, width: 40, rotate: 8 }
          ]
        },
        {
          id: 'service',
          label: 'Service & Accueil',
          cover: { src: '/images/cover-service.jpg', alt: 'Deux employés souriants au service' },
          stickers: [
            { id: 'bell', asset: { src: '/images/sticker-bell.png', alt: '' }, x: 30, y: 70, width: 38, rotate: -6 }
          ]
        }
      ]
    },
    {
      id: 'about',
      type: 'about',
      title: 'À propos',
      body: 'Une filière ouverte et accessible, où le savoir-faire, l’engagement et l’expérience pèsent autant que les diplômes : on peut y entrer par un CAP, un bac pro, un BTS ou un Bachelor, et évoluer rapidement vers des postes à responsabilités. Hôtels, restaurants, agences de voyage, croisières, événementiel : les terrains de jeu sont nombreux, en France comme à l’étranger.',
      stats: {
        medianStartingSalary: 2000,
        openPositions: { count: 319000, year: 2026 },
        professionalsCount: 1300000,
        trainingsCount: 797
      }
    },
    {
      id: 'faq',
      type: 'faq',
      title: 'Bon à savoir',
      items: [
        {
          id: 'bac',
          question: 'Bac général, techno ou pro ?',
          answer: 'Tous les bacs mènent au secteur. Le bac pro permet d’entrer vite dans la vie active, le bac STHR (techno) est taillé pour poursuivre en BTS, et un bac général ouvre les portes des Bachelors et écoles de management hôtelier.'
        },
        {
          id: 'diplomes',
          question: 'CAP, BTS ou Bachelor ?',
          answer: 'Le CAP forme en 2 ans à un métier précis (cuisine, service). Le BTS MHR apporte une vision plus large et des postes d’encadrement. Le Bachelor vise la gestion, le marketing ou l’international.'
        },
        {
          id: 'recrutement',
          question: 'Le secteur recrute-t-il vraiment ?',
          answer: 'Oui : plus de 300 000 postes sont à pourvoir chaque année. Les profils motivés trouvent rapidement, souvent dès la fin de leur alternance.'
        },
        {
          id: 'ia',
          question: 'Et par rapport à l’IA ?',
          answer: 'L’accueil, le service et la cuisine reposent sur le contact humain et le geste : des métiers parmi les moins exposés à l’automatisation. L’IA aide surtout côté réservations et gestion.'
        }
      ]
    },
    {
      id: 'pros-cons',
      type: 'prosCons',
      title: 'Le métier sans filtre',
      items: [
        {
          id: 'ouvert',
          kind: 'pro',
          title: 'Un métier ouvert à tous',
          body: 'Le savoir-faire, l’engagement et l’expérience comptent autant que les diplômes. On peut commencer par un CAP et évoluer vers des responsabilités.'
        },
        {
          id: 'evolution',
          kind: 'pro',
          title: 'De vraies perspectives d’évolution',
          body: 'Tu peux progresser rapidement, travailler partout dans le monde, rejoindre le luxe ou ouvrir ton propre établissement.'
        },
        {
          id: 'horaires',
          kind: 'con',
          title: 'Des horaires décalés',
          body: 'Soirées, week-ends et jours fériés : tu travailles quand les autres se détendent. Il faut aimer ce rythme.'
        },
        {
          id: 'physique',
          kind: 'con',
          title: 'Un métier physique',
          body: 'Station debout, coups de feu, pression du service : l’endurance et la gestion du stress font partie du job.'
        }
      ]
    },
    {
      id: 'cta',
      type: 'cta',
      title: 'Quelle voie est faite pour toi ?',
      subtitle: 'En 2 min. top chrono !',
      buttonLabel: 'Passe le test',
      href: 'https://www.edumapper.com'
    },
    {
      id: 'tips',
      type: 'tips',
      title: 'Prends une longueur d’avance',
      items: [
        { id: 'culture', emoji: '📌', text: 'Développe ta culture du secteur : nouvelles adresses, destinations, cultures étrangères…' },
        { id: 'langues', emoji: '🌍', text: 'Travaille tes langues : l’anglais est indispensable, une deuxième langue fait la différence.' },
        { id: 'job', emoji: '🍽️', text: 'Teste-toi avec un job d’été ou un stage en restaurant, hôtel ou office de tourisme.' },
        { id: 'reseau', emoji: '🤝', text: 'Parle avec des pros : salons, journées portes ouvertes, réseaux sociaux.' }
      ]
    }
  ]
} satisfies JobPage
